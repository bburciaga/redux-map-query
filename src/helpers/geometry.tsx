import { center, distance, multiPolygon, polygon } from "@turf/turf";
import L, { LatLngBounds } from "leaflet";

const length = 0.745201235056549;
const width = 1.135711669921875;

/**
 * Used to generate array of numbers to be used for rectangle GeoJSON object
 * @param center position of map or GeoJSON object
 * @returns number [][][] 
 */
function createBoundFromCenter(center: { lat: number; lng: number }) {
  return [
    [
      [center.lng + width, center.lat + length],
      [center.lng + width, center.lat - length],
      [center.lng - width, center.lat - length],
      [center.lng - width, center.lat + length],
      [center.lng + width, center.lat + length],
    ],
  ];
}

/**
 * Purpose to be used for user geometry to contain properties as well
 * @param latLngBounds object generated from React Leaflet map.getBounds()
 * @returns geojson
 */
function createUserGeo(latLngBounds: LatLngBounds) {
  const latlngs = [];

  latlngs.push(latLngBounds.getSouthWest());
  latlngs.push(latLngBounds.getSouthEast());
  latlngs.push(latLngBounds.getNorthEast());
  latlngs.push(latLngBounds.getNorthWest());

  const tempGeo = L.polygon(latlngs).toGeoJSON();

  tempGeo.properties.center = latLngBounds.getCenter();
  tempGeo.properties.northEast = latLngBounds.getNorthEast();
  tempGeo.properties.southWest = latLngBounds.getSouthWest();

  return tempGeo;
}

/**
 * creates extent with properties
 * @param coordArr coordinate array
 * @param center center of new object
 * @returns geojson
 */
function createPolygonFromArray(
  coordArr: number[][][],
  center: { lat: number; lng: number }
) {
  const aGeo: any = polygon(coordArr);
  aGeo.properties.center = center;

  aGeo.properties.center = center;
  aGeo.properties.northEast = {
    lat: center.lat + length,
    lng: center.lng + width,
  };
  aGeo.properties.southWest = {
    lat: center.lat - length,
    lng: center.lng - width,
  };
  aGeo.properties.timestamp = Date.now();

  return aGeo;
}

/**
 * Creates a new extent for the bufferedExtents
 * @param center position to base next extent off of
 * @param direction (optional) to indicate where to put next extent
 * @returns geojson
 */
function createExtent(
  center: { lat: number; lng: number },
  direction?: string
) {
  let newCenter: { lat: number; lng: number } = center;
  if (direction) {
    const firstChar = direction.charAt(0);
    switch (firstChar) {
      case "n":
        break;
      case "s":
        break;
      case "e":
        break;
      case "w":
        break;
    }
  }

  const tempBound: any = createBoundFromCenter(newCenter);

  const tempGeo = createPolygonFromArray(tempBound, newCenter);
  
  tempGeo.properties.northEast = { lat: center.lat + length, lng: center.lng + width };
  tempGeo.properties.southWest = { lat: center.lat - length, lng: center.lng - width };

  return tempGeo;
}

function getClosestExtent(userCenter: { lat: number, lng: number }, extents: any[]) {
  let closestDistance: number = -1;
  let closestFeature: any;


  extents.forEach((buffer: any) => {
    const bCenter = buffer.properties.center;
    if (!closestFeature) {
      closestDistance = distance(
        [bCenter.lng, bCenter.lat],
        [userCenter.lng, userCenter.lat]
      );
      closestFeature = buffer;
    }
    if (closestFeature) {
      const tempDistance = distance(
        [bCenter.lng, bCenter.lat],
        [userCenter.lng, userCenter.lat]
      );
      if (tempDistance < closestDistance) {
        closestDistance = tempDistance;
        closestFeature = buffer;
      }
    }
  });

  return closestFeature;
}

function getDirectionFromCenter (aCenter: { lat: number, lng: number }, extents: any[]) {
    const multiPoly: any = multiPolygon(
      extents.map((item: any) => {
        return item.geometry.coordinates;
      })
    );
    const tempCenter: any = center(multiPoly).geometry.coordinates;
    const mpCenter = { lat: tempCenter[1], lng: tempCenter[0] };

    let direction: string = "";

    if (aCenter.lat > mpCenter.lat) {
      direction += "n";
    }
    if (aCenter.lat < mpCenter.lat) {
      direction += "s";
    }
    if (aCenter.lng > mpCenter.lng) {
      direction += "e";
    }
    if (aCenter.lng < mpCenter.lng) {
      direction += "w";
    }

    return direction;
}

function getDirectionFromBound (aCenter: { lat: number, lng: number }, aGeo: any) {
    const cbNE = aGeo.properties.northEast;
    const cbSW = aGeo.properties.southWest;

    let direction = "";

    if (aCenter.lat > cbNE.lat) {
      direction += "n";
    }
    if (aCenter.lat < cbSW.lat) {
      direction += "s";
    }
    if (aCenter.lng > cbNE.lng) {
      direction += "e";
    }
    if (aCenter.lng < cbSW.lng) {
      direction += "w";
    }

    return direction;
}

export { createUserGeo, createExtent, getClosestExtent, getDirectionFromBound };

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
 * used in association with the createExtent function in case there is two directions
 * (e.g. nw, ne, sw, se)
 * @param direction string to indicate where to put next extent
 * @param newCenter to be used for next extent when creating polygon
 * @returns { lat: number, lng: number }
 */
function createExtentHelper(
  direction: string,
  newCenter: { lat: number; lng: number }
) {
  if (direction.length > 1) {
    if (direction.charAt(1) === "e") {
      newCenter.lng = newCenter.lng + 2 * width;
    }
    if (direction.charAt(1) === "w") {
      newCenter.lng = newCenter.lng - 2 * width;
    }
  }
  return newCenter;
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
        newCenter = { lat: center.lat + 2 * length, lng: center.lng };
        newCenter = createExtentHelper(direction, newCenter);
        break;
      case "s":
        newCenter = { lat: center.lat - 2 * length, lng: center.lng };
        newCenter = createExtentHelper(direction, newCenter);
        break;
      case "e":
        newCenter = { lat: center.lat, lng: center.lng + 2 * width };
        break;
      case "w":
        newCenter = { lat: center.lat, lng: center.lng - 2 * width };
        break;
    }
  }

  const tempBound: any = createBoundFromCenter(newCenter);

  const tempGeo = createPolygonFromArray(tempBound, newCenter);

  return tempGeo;
}

function getNextExtent(userGeo: any, extentGeo: any) {
  if (extentGeo.properties.northEast.lat < userGeo.properties.northEast.lat) {
    return createExtent(extentGeo.properties.center, "n");
  }
  if (extentGeo.properties.northEast.lng < userGeo.properties.northEast.lng) {
    return createExtent(extentGeo.properties.center, "e");
  }
  if (extentGeo.properties.southWest.lat > userGeo.properties.southWest.lat) {
    return createExtent(extentGeo.properties.center, "s");
  }
  if (extentGeo.properties.southWest.lng > userGeo.properties.southWest.lng) {
    return createExtent(extentGeo.properties.center, "w");
  }
}

function getClosestExtent(
  userCenter: { lat: number; lng: number },
  extents: any[]
) {
  let closestDistance: number = -1;
  let closestFeature: any;

  extents.forEach((extent: any) => {
    const eCenter = extent.properties.center;
    if (!closestFeature) {
      closestDistance = distance(
        [eCenter.lng, eCenter.lat],
        [userCenter.lng, userCenter.lat]
      );
      closestFeature = extent;
    }
    if (closestFeature) {
      const tempDistance = distance(
        [eCenter.lng, eCenter.lat],
        [userCenter.lng, userCenter.lat]
      );
      if (tempDistance < closestDistance) {
        closestDistance = tempDistance;
        closestFeature = extent;
      }
    }
  });

  return closestFeature;
}

function getDirectionFromCenter(
  aCenter: { lat: number; lng: number },
  extents: any[]
) {
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

function getDirectionFromBound(
  aCenter: { lat: number; lng: number },
  aGeo: any
) {
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

export {
  createUserGeo,
  createExtent,
  getNextExtent,
  getClosestExtent,
  getDirectionFromBound,
  getDirectionFromCenter,
};

import {
  center,
  difference,
  distance,
  multiPolygon,
  polygon,
} from "@turf/turf";
import L, { LatLngBounds } from "leaflet";

const length = 0.745201235056549;
const width = 1.135711669921875;

function createFeatureCollection(features: any[]) {
  return {
    type: "FeatureCollection",
    features: features
  }
}

function createMultiPolyFromIntersects(intersects: any[]) {
  return multiPolygon(
    intersects.map((feature: any) => {
      return feature.geometry.coordinates;
    })
  );
}

/**
 * Used to generate array of numbers to be used for rectangle GeoJSON object
 * @param center position of map or GeoJSON object
 * @returns number [][][]
 */
function createBoundFromCenter(aCenter: { lat: number; lng: number }) {
  return [
    [
      [aCenter.lng + width, aCenter.lat + length],
      [aCenter.lng + width, aCenter.lat - length],
      [aCenter.lng - width, aCenter.lat - length],
      [aCenter.lng - width, aCenter.lat + length],
      [aCenter.lng + width, aCenter.lat + length],
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
  aCenter: { lat: number; lng: number }
) {
  const aGeo: any = polygon(coordArr);
  aGeo.properties.center = aCenter;

  aGeo.properties.center = aCenter;
  aGeo.properties.northEast = {
    lat: aCenter.lat + length,
    lng: aCenter.lng + width,
  };
  aGeo.properties.southWest = {
    lat: aCenter.lat - length,
    lng: aCenter.lng - width,
  };
  aGeo.properties.timestamp = Date.now();

  return aGeo;
}

function getNewCenter(aCenter: { lat: number; lng: number }, direction: string) {
  switch (direction[0]) {
    case "n":
      return { lat: aCenter.lat + 2 * length, lng: aCenter.lng };
    case "s":
      return { lat: aCenter.lat - 2 * length, lng: aCenter.lng };
    case "e":
      return { lat: aCenter.lat, lng: aCenter.lng + 2 * width };
    case "w":
      return { lat: aCenter.lat, lng: aCenter.lng - 2 * width };
  }
  return aCenter;
}

/**
 * Creates a new extent for the bufferedExtents
 * @param center position to base next extent off of
 * @param direction (optional) to indicate where to put next extent
 * @returns geojson
 */
function createExtent(
  aCenter: { lat: number; lng: number },
  direction?: string
) {
  let newCenter: { lat: number; lng: number } = aCenter;
  if (direction) {
    newCenter = getNewCenter(aCenter, direction);
    if (direction.length > 1)
      newCenter = getNewCenter(newCenter, direction.charAt(1));
  }

  const tempBound: any = createBoundFromCenter(newCenter);

  return createPolygonFromArray(tempBound, newCenter);
}

function getNextExtent(userGeo: any, extentGeo: any) {
  const tempArr = [];
  if (extentGeo.properties.northEast.lat < userGeo.properties.northEast.lat) {
    tempArr.push(createExtent(extentGeo.properties.center, "n"));
  }
  if (extentGeo.properties.southWest.lat > userGeo.properties.southWest.lat) {
    tempArr.push(createExtent(extentGeo.properties.center, "s"));
  }
  if (extentGeo.properties.northEast.lng < userGeo.properties.northEast.lng) {
    tempArr.push(createExtent(extentGeo.properties.center, "e"));
  }
  if (extentGeo.properties.southWest.lng > userGeo.properties.southWest.lng) {
    tempArr.push(createExtent(extentGeo.properties.center, "w"));
  }
  if (tempArr.length > 1) {
    const d1 = distance(
      [userGeo.properties.center.lng, userGeo.properties.center.lat],
      [tempArr[0].properties.center.lng, tempArr[0].properties.center.lat]
    );
    const d2 = distance(
      [userGeo.properties.center.lng, userGeo.properties.center.lat],
      [tempArr[1].properties.center.lng, tempArr[1].properties.center.lat]
    );
    if (d1 > d2) return tempArr[1];
  }
  return tempArr[0];
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

function removeFurthestExtent(
  aCenter: { lat: number; lng: number },
  extents: any[]
) {
  const tempExtents = extents;
  const timestamps = tempExtents.map((e) => {
    return e.properties.timestamp;
  });

  if (tempExtents.length > 4) {
    let furthestDistance = -1;
    let index = -1;

    for (let i = 0; i < tempExtents.length; i++) {
      const tempCenter = tempExtents[i].properties.center;
      const tempDistance = distance(
        [tempCenter.lng, tempCenter.lat],
        [aCenter.lng, aCenter.lat]
      );
      if (furthestDistance < tempDistance) {
        furthestDistance = tempDistance;
        index = i;
      }
    }

    if (index > -1) {
      const _temp: any = tempExtents.splice(index, 1);
      timestamps.splice(index, 1);
    }
  }
  return { updated_extents: tempExtents, timestamps: timestamps };
}

export {
  createUserGeo,
  createExtent,
  createFeatureCollection,
  createMultiPolyFromIntersects,
  getNextExtent,
  getClosestExtent,
  getDirectionFromBound,
  getDirectionFromCenter,
  getNewCenter,
  removeFurthestExtent,
};

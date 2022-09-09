import { polygon } from "@turf/turf";
import L, { LatLngBounds } from "leaflet";

const length = 0.745201235056549;
const width = 1.135711669921875;

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

function createPolygonFromBoundsObject(latLngBounds: LatLngBounds) {
  const latlngs = [];

  latlngs.push(latLngBounds.getSouthWest());
  latlngs.push(latLngBounds.getSouthEast());
  latlngs.push(latLngBounds.getNorthEast());
  latlngs.push(latLngBounds.getNorthWest());

  return L.polygon(latlngs).toGeoJSON();
}

function createPolygonFromBoundsArray(
  arr: number[][][],
  center: { lat: number; lng: number }
) {
  const aGeo: any = polygon(arr);
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

  return createPolygonFromBoundsArray(tempBound, newCenter);
}

export { createPolygonFromBoundsObject, createExtent };

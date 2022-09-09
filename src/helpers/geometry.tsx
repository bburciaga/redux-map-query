import L, { LatLngBounds } from "leaflet";

function createPolygonFromBound(latLngBounds: LatLngBounds) {
  const latlngs = [];

  latlngs.push(latLngBounds.getSouthWest());
  latlngs.push(latLngBounds.getSouthEast());
  latlngs.push(latLngBounds.getNorthEast());
  latlngs.push(latLngBounds.getNorthWest());

  return L.polygon(latlngs).toGeoJSON();
}

function createBound(center: { lat: number; lng: number }) {}

export { createPolygonFromBound, createBound };

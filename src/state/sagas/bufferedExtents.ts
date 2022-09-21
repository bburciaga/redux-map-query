import {
  BUFFERED_EXTENTS_INITIALIZE,
  BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_SUCCESS,
  BUFFERED_EXTENTS_UPDATE_FAIL,
  CACHED_DATA_INITIALIZE,
  CACHED_DATA_UPDATE_REQUEST,
} from "../actions";
import { all, put, takeEvery, throttle, call } from "redux-saga/effects";
import {
  createExtent,
  getClosestExtent,
  getDirectionFromBound,
  getDirectionFromCenter,
  getNextExtent,
  removeFurthestExtent,
} from "../../helpers/geometry";
import { center, difference, multiPolygon } from "@turf/turf";
import { getGeoJSON } from "../../DataBCShapes";

function* handle_BUFFERED_EXTENTS_INITIALIZE(action: any) {
  const { extents } = action.payload;

  try {
    const fetch_geo = extents[0];
    const newData: any[] = [];

    yield getGeoJSON(
      "WHSE_WATER_MANAGEMENT.WLS_WATER_RESERVES_POLY",
      fetch_geo
    ).then((returnVal) => {
      returnVal.features.map((feature: any) => {
        feature.properties.extent_id = fetch_geo.properties.timestamp;
        newData.push(feature);
      });
    });

    yield put({
      type: CACHED_DATA_INITIALIZE,
      payload: {
        feature_collection: {
          type: "FeatureCollection",
          features: newData,
        },
      },
    });
  } catch (error: any) {
    yield put({
      type: BUFFERED_EXTENTS_UPDATE_FAIL,
      payload: error
    });
  }
}

function* handle_BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS(action: any) {
  const { aGeo, extents, cached_features, count } = action.payload;

  try {
    const closestExtent: any = getClosestExtent(aGeo.properties.center, extents);
    const direction: string = getDirectionFromBound(
      aGeo.properties.center,
      closestExtent
    );
    const newExtent: any = createExtent(
      closestExtent.properties.center,
      direction
    );

    const { updated_extents, timestamps } = removeFurthestExtent(
      aGeo.properties.center,
      extents
    );

    yield put({
      type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
      payload: {
        features: [...updated_extents, newExtent],
        fetch_geo: newExtent,
        timestamps: timestamps,
        old_features: cached_features,
        count: count,
      },
    });
  } catch (error: any) {
    yield put({
      type: BUFFERED_EXTENTS_UPDATE_FAIL,
      payload: error
     });
   }
}

function* handle_BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTION(action: any) {
  const { aGeo, intersects, extents, cached_features, count } = action.payload;

  if (difference(action.payload.aGeo, intersects[0])) {
    const closestExtent = getClosestExtent(aGeo.properties.center, extents);
    const newExtent = getNextExtent(action.payload.aGeo, closestExtent);

    const { updated_extents, timestamps } = removeFurthestExtent(
      aGeo.properties.center,
      extents
    );

    yield put({
      type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
      payload: {
        features: [...updated_extents, newExtent],
        fetch_geo: newExtent,
        timestamps: timestamps,
        old_features: cached_features,
        count: count,
      },
    });
  }
}

function* handle_BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS(action: any) {
  const { aGeo, intersects, extents, cached_features, count } = action.payload;

  const intersectsMultiPoly: any = multiPolygon(
    intersects.map((feature: any) => {
      return feature.geometry.coordinates;
    })
  );

  if (difference(aGeo, intersectsMultiPoly)) {
    const closestExtent = getClosestExtent(aGeo.properties.center, intersects);

    intersectsMultiPoly.properties.center = {
      lat: center(intersectsMultiPoly).geometry.coordinates[1],
      lng: center(intersectsMultiPoly).geometry.coordinates[0],
    };
    // get difference for check
    const diff = difference(aGeo, intersectsMultiPoly);

    const diffCenter: any = diff
      ? {
          lat: center(diff).geometry.coordinates[1],
          lng: center(diff).geometry.coordinates[0],
        }
      : null;

    let newExtent: any;
    // check north
    if (
      diffCenter &&
      diffCenter.lat > intersectsMultiPoly.properties.center.lat &&
      diffCenter.lat > closestExtent.properties.center.lat
    ) {
      newExtent = createExtent(closestExtent.properties.center, "n");
    }
    // check south
    if (
      diffCenter &&
      diffCenter.lat < intersectsMultiPoly.properties.center.lat &&
      diffCenter.lat < closestExtent.properties.center.lat
    ) {
      newExtent = createExtent(closestExtent.properties.center, "s");
    }
    // check east
    if (
      diffCenter &&
      diffCenter.lng > intersectsMultiPoly.properties.center.lng &&
      diffCenter.lng > closestExtent.properties.center.lng
    ) {
      newExtent = createExtent(closestExtent.properties.center, "e");
    }
    // check west
    if (
      diffCenter &&
      diffCenter.lng < intersectsMultiPoly.properties.center.lng &&
      diffCenter.lng < closestExtent.properties.center.lng
    ) {
      newExtent = createExtent(closestExtent.properties.center, "w");
    }

    const { updated_extents, timestamps } = yield removeFurthestExtent(
      aGeo.properties.center,
      extents
    );

    if (newExtent) {
      yield put({
        type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
        payload: {
          features: [...updated_extents, newExtent],
          fetch_geo: newExtent,
          timestamps: timestamps,
          old_features: cached_features,
          count: count,
        },
      });
    }
  }
}

function* handle_BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS(action: any) {
  const { aGeo, intersects, extents, cached_features, count } = action.payload;

  const intersectsMultiPoly: any = multiPolygon(
    intersects.map((feature: any) => {
      return feature.geometry.coordinates;
    })
  );

  if (difference(aGeo, intersectsMultiPoly)) {
    // check where each geo is
    const tempExtents: any[] = [];
    intersects.forEach((feature: any) => {
      feature.properties.direction = getDirectionFromCenter(
        feature.properties.center,
        [aGeo]
      );
      if (feature.properties.direction) tempExtents.push(feature);
    });

    let adjacent: any;

    const coolstring =
      "" +
      tempExtents.map((b: any) => {
        return b.properties.direction;
      });

    const assignAdjacent = (direction1: string, direction2: string) => {
      tempExtents.forEach((e: any) => {
        if (
          e.properties.direction === direction1 ||
          e.properties.direction === direction2
        ) {
          adjacent = e;
        }
      });
    };

    const getNextExtent = (direction: string) => {
      if (adjacent.properties.direction.includes("n")) {
        return createExtent(
          adjacent.properties.center,
          direction[0] === "n" ? direction[1] : direction[0]
        );
      }
      if (adjacent.properties.direction.includes("s")) {
        return createExtent(
          adjacent.properties.center,
          direction[0] === "s" ? direction[1] : direction[0]
        );
      }
    };

    let newExtent: any;

    // once all geos are obtained check where to put the next geometry
    if (!coolstring.includes("ne")) {
      assignAdjacent("nw", "se");
      newExtent = getNextExtent("ne");
    }
    if (!coolstring.includes("nw")) {
      assignAdjacent("ne", "sw");
      newExtent = getNextExtent("nw");
    }
    if (!coolstring.includes("se")) {
      assignAdjacent("ne", "sw");
      newExtent = getNextExtent("se");
    }
    if (!coolstring.includes("sw")) {
      assignAdjacent("nw", "se");
      newExtent = getNextExtent("sw");
    }

    const { updated_extents, timestamps } = removeFurthestExtent(
      aGeo.properties.center,
      extents
    );

    yield put({
      type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
      payload: {
        features: [...updated_extents, newExtent],
        fetch_geo: newExtent,
        timestamps: timestamps,
        old_features: cached_features,
        count: count,
      },
    });
  }
}

function* handle_BUFFERED_EXTENTS_UPDATE_SUCCESS(action: any) {
  const { fetch_geo, timestamps, old_features } = action.payload;
  const newData: any = [];

  yield getGeoJSON(
      "WHSE_WATER_MANAGEMENT.WLS_WATER_RESERVES_POLY",
      fetch_geo
    ).then((returnVal) => {
      returnVal.features.map((feature: any) => {
        feature.properties.extent_id = fetch_geo.properties.timestamp;
        newData.push(feature);
    });
  });

  yield put({
    type: CACHED_DATA_UPDATE_REQUEST,
    payload: {
      new_features: newData,
      timestamps: timestamps,
      old_features: old_features,
    },
  });
}

export default function* bufferedExtentsSaga() {
  yield all([
    takeEvery(BUFFERED_EXTENTS_INITIALIZE, handle_BUFFERED_EXTENTS_INITIALIZE),
    takeEvery(
      BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS_REQUEST,
      handle_BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS
    ),
    takeEvery(
      BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTIONS_REQUEST,
      handle_BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTION
    ),
    takeEvery(
      BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS_REQUEST,
      handle_BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS
    ),
    takeEvery(
      BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS_REQUEST,
      handle_BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS
    ),
    takeEvery(
      BUFFERED_EXTENTS_UPDATE_SUCCESS,
      handle_BUFFERED_EXTENTS_UPDATE_SUCCESS
    ),
  ]);
}

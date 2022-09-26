import { center, difference, multiPolygon } from "@turf/turf";
import { put, select } from "redux-saga/effects";
import {
  createExtent,
  createFeatureCollection,
  createMultiPolyFromIntersects,
  getClosestExtent,
  getDirectionFromBound,
  getDirectionFromCenter,
  getNextExtent,
  removeFurthestExtent,
} from "../../helpers/geometry";
import {
  BUFFERED_EXTENTS_INITIALIZE_SUCCESS,
  BUFFERED_EXTENTS_NOTHING_TO_UPDATE,
  BUFFERED_EXTENTS_REMOVE_FURTHEST_FAIL,
  BUFFERED_EXTENTS_REMOVE_FURTHEST_REQUEST,
  BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS,
  BUFFERED_EXTENTS_UPDATE_FAIL,
  BUFFERED_EXTENTS_UPDATE_SUCCESS,
  CACHED_DATA_INITIALIZE_FAIL,
  CACHED_DATA_REMOVE_FURTHEST_FAIL,
  CACHED_DATA_REMOVE_FURTHEST_REQUEST,
  CACHED_DATA_UPDATE_FAIL,
  CACHED_DATA_UPDATE_REQUEST,
} from "../actions";
import { selectBufferedExtents } from "../reducers/bufferedExtents";

function* handle_BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS(action: any) {
  const { aGeo } = action.payload;
  const bufferedExtents = yield select(selectBufferedExtents);

  try {
    if (bufferedExtents.data.features.length > 0) {
      const closestExtent: any = getClosestExtent(
        aGeo.properties.center,
        bufferedExtents.data.features
      );
      const direction: string = getDirectionFromBound(
        aGeo.properties.center,
        closestExtent
      );
      const newExtent: any = createExtent(
        closestExtent.properties.center,
        direction
      );

      yield put({
        type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection([...bufferedExtents.data.features, newExtent]),
          fetch_geo: newExtent,
          count: bufferedExtents.count + 1,
        },
      });
    } else {
      const newExtent = createExtent(aGeo.properties.center);
      yield put({
        type: BUFFERED_EXTENTS_INITIALIZE_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection([newExtent]),
          fetch_geo: newExtent,
          count: bufferedExtents.count + 1,
        },
      });
    }
  } catch (error: any) {
    yield put({
      type: BUFFERED_EXTENTS_UPDATE_FAIL,
      payload: error,
    });
  }
}

function* handle_BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTION(action: any) {
  const { aGeo, intersects } = action.payload;

  try {
    const bufferedExtents = yield select(selectBufferedExtents);

    if (difference(action.payload.aGeo, intersects[0])) {
      const closestExtent = getClosestExtent(
        aGeo.properties.center,
        bufferedExtents.data.features
      );
      const newExtent = getNextExtent(action.payload.aGeo, closestExtent);

      yield put({
        type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection([...bufferedExtents.data.features, newExtent]),
          fetch_geo: newExtent,
          count: bufferedExtents.count + 1,
        },
      });
    } else {
      yield put({
        type: BUFFERED_EXTENTS_NOTHING_TO_UPDATE
      });
    }
  } catch (error: any) {
    yield put({
      type: BUFFERED_EXTENTS_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function createExtentBasedOnDifference (diffCenter: {lat: number, lng: number}, multipoly: any, closestExtent: any) {
  // check north
  if (
    diffCenter.lat > multipoly.properties.center.lat &&
    diffCenter.lat > closestExtent.properties.center.lat
  ) {
    return createExtent(closestExtent.properties.center, "n");
  }
  // check south
  if (
    diffCenter.lat < multipoly.properties.center.lat &&
    diffCenter.lat < closestExtent.properties.center.lat
  ) {
    return createExtent(closestExtent.properties.center, "s");
  }
  // check east
  if (
    diffCenter.lng > multipoly.properties.center.lng &&
    diffCenter.lng > closestExtent.properties.center.lng
  ) {
    return createExtent(closestExtent.properties.center, "e");
  }
  // check west
  if (
    diffCenter.lng < multipoly.properties.center.lng &&
    diffCenter.lng < closestExtent.properties.center.lng
  ) {
    return createExtent(closestExtent.properties.center, "w");
  }
}

function* handle_BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS(action: any) {
  const { aGeo, intersects } = action.payload;

  try {
    const bufferedExtents = yield select(selectBufferedExtents);

    const intersectsMultiPoly: any = createMultiPolyFromIntersects(intersects);

    if (difference(aGeo, intersectsMultiPoly)) {
      const closestExtent = getClosestExtent(
        aGeo.properties.center,
        intersects
      );

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

      const newExtent: any = createExtentBasedOnDifference(diffCenter, intersectsMultiPoly, closestExtent);

      yield put({
        type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection([...bufferedExtents.data.features, newExtent]),
          fetch_geo: newExtent,
          count: bufferedExtents.count + 1,
        },
      });
    } else {
      yield put({
        type: BUFFERED_EXTENTS_NOTHING_TO_UPDATE
      });
    }
  } catch (error) {
    yield put({
      type: BUFFERED_EXTENTS_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function* handle_BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS(action: any) {
  const { aGeo, intersects } = action.payload;

  try {
    const bufferedExtents = yield select(selectBufferedExtents);

    const intersectsMultiPoly: any = createMultiPolyFromIntersects(intersects);

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

      const getCornerExtent = (direction: string) => {
        if (adjacent.properties.direction.includes("n")) {
          return createExtent(
            adjacent.properties.center,
            direction[0] === "n" ? direction[1] : direction[0]
          );
        }
        else {
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
        newExtent = getCornerExtent("ne");
      }
      if (!coolstring.includes("nw")) {
        assignAdjacent("ne", "sw");
        newExtent = getCornerExtent("nw");
      }
      if (!coolstring.includes("se")) {
        assignAdjacent("ne", "sw");
        newExtent = getCornerExtent("se");
      }
      if (!coolstring.includes("sw")) {
        assignAdjacent("nw", "se");
        newExtent = getCornerExtent("sw");
      }

      yield put({
        type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection([...bufferedExtents.data.features, newExtent]),
          fetch_geo: newExtent,
          count: bufferedExtents.count + 1,
        },
      });
    }
  } catch (error: any) {
    yield put({
      type: BUFFERED_EXTENTS_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function* handle_BUFFERED_EXTENTS_INITIALIZE_SUCCESS(action: any) {
  const { fetch_geo } = action.payload;

  try {
    yield put({
      type: CACHED_DATA_UPDATE_REQUEST,
      payload: {
        fetch_geo: fetch_geo,
        initialize: true,
      },
    });
  } catch (error: any) {
    yield put({
      type: CACHED_DATA_INITIALIZE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function* handle_BUFFERED_EXTENTS_UPDATE_SUCCESS(action: any) {
  const { fetch_geo } = action.payload;

  try {
    yield put({
      type: CACHED_DATA_UPDATE_REQUEST,
      payload: {
        fetch_geo: fetch_geo,
        initialize: false,
      },
    });
  } catch (error: any) {
    yield put({
      type: CACHED_DATA_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function* handle_BUFFERED_EXTENTS_REMOVE_FURTHEST_REQUEST(action: any) {
  const { current_extent } = action.payload;
  const bufferedExtents = yield select(selectBufferedExtents);

  const { updated_extents, update_cached, timestamps } = removeFurthestExtent(
    current_extent.properties.center,
    bufferedExtents.data.features
  );

  try {
    if (update_cached) {
      yield put({
        type: BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection(updated_extents),
          update_cached: update_cached,
          timestamps: timestamps
        }
      })
    } else {
      yield put({
        type: BUFFERED_EXTENTS_NOTHING_TO_UPDATE,
      });
    }
  } catch (error: any) {
    yield put({
      type: BUFFERED_EXTENTS_REMOVE_FURTHEST_FAIL,
      payload: {
        error: error
      }
    });
  }
}

function* handle_BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS(action: any) {
  const { timestamps, update_cached } = action.payload;

  try {
    if (update_cached) {
      yield put({
        type: CACHED_DATA_REMOVE_FURTHEST_REQUEST,
        payload: {
          timestamps: timestamps
        }
      });
    }
  } catch (error: any) {
    yield put({
      type: CACHED_DATA_REMOVE_FURTHEST_FAIL,
      payload: {
        error: error
      }
    });
  }
}

export {
  handle_BUFFERED_EXTENTS_INITIALIZE_SUCCESS,
  handle_BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS,
  handle_BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTION,
  handle_BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS,
  handle_BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS,
  handle_BUFFERED_EXTENTS_UPDATE_SUCCESS,
  handle_BUFFERED_EXTENTS_REMOVE_FURTHEST_REQUEST,
  handle_BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS
};

import {
  BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_SUCCESS,
} from "../actions";
import { all, put, takeEvery } from "redux-saga/effects";
import {
  createExtent,
  getClosestExtent,
  getDirectionFromBound,
  getDirectionFromCenter,
  getNextExtent,
} from "../../helpers/geometry";
import { center, difference, multiPolygon } from "@turf/turf";

function* handle_BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS(action: any) {
  const closestExtent: any = getClosestExtent(
    action.payload.userCenter,
    action.payload.extents
  );
  const direction: string = getDirectionFromBound(
    action?.payload.userCenter,
    closestExtent
  );
  const newExtent: any = createExtent(
    closestExtent.properties.center,
    direction
  );

  yield put({
    type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
    payload: { extents: [...action.payload.extents, newExtent] },
  });
}

function* handle_BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTION(action: any) {
  const intersectsMultiPoly: any = multiPolygon(
    action.payload.intersects.map((feature: any) => {
      return feature.geometry.coordinates;
    })
  );

  if (difference(action.payload.aGeo, intersectsMultiPoly)) {
    const closestExtent = getClosestExtent(
      action.payload.aGeo,
      action.payload.extents
    );
    const newExtent = getNextExtent(action.payload.aGeo, closestExtent);

    yield put({
      type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
      payload: {
        extents: [...action.payload.extents, newExtent],
      },
    });
  }
}

function* handle_BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS(action: any) {
  const { aGeo, intersects, extents } = action.payload;
  const intersectsMultiPoly: any = multiPolygon(
    intersects.map((feature: any) => {
      return feature.geometry.coordinates;
    })
  );

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

  yield put({
    type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
    payload: {
      extents: [...extents, newExtent],
    },
  });
}

function* handle_BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS(action: any) {
  const { aGeo, intersects, extents } = action.payload;
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

  yield put({
    type: BUFFERED_EXTENTS_UPDATE_SUCCESS,
    payload: {
      extents: [...extents, newExtent],
    },
  });
}

export default function* bufferedExtentsSaga() {
  yield all([
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
  ]);
}

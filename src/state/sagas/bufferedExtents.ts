import {
  BUFFERED_EXTENTS_INITIALIZE_SUCCESS,
  BUFFERED_EXTENTS_REMOVE_FURTHEST_REQUEST,
  BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS,
  BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_SUCCESS,
} from "../actions";
import { all, takeEvery } from "redux-saga/effects";
import {
  // handle_BUFFERED_EXTENTS_INITIALIZE_REQUEST,
  handle_BUFFERED_EXTENTS_INITIALIZE_SUCCESS,
  handle_BUFFERED_EXTENTS_REMOVE_FURTHEST_REQUEST,
  handle_BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS,
  handle_BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS,
  handle_BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTION,
  handle_BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS,
  handle_BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS,
  handle_BUFFERED_EXTENTS_UPDATE_SUCCESS,
} from "../handlers/bufferedExtents";

/**
 * To be exported
 * Creates saga for BUFFERED EXTENTS to utilize the handlers
 */
export default function* bufferedExtentsSaga() {
  yield all([
    takeEvery(
      BUFFERED_EXTENTS_INITIALIZE_SUCCESS,
      handle_BUFFERED_EXTENTS_INITIALIZE_SUCCESS
    ),
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
    takeEvery(
      BUFFERED_EXTENTS_REMOVE_FURTHEST_REQUEST,
      handle_BUFFERED_EXTENTS_REMOVE_FURTHEST_REQUEST
    ),
    takeEvery(
      BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS,
      handle_BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS
    ),
  ]);
}

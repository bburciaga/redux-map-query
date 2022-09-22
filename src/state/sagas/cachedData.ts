import { all, takeEvery } from "redux-saga/effects";
import {
  CACHED_DATA_UPDATE_REQUEST,
  CACHED_DATA_INITIALIZE_REQUEST,
} from "../actions";
import { handle_CACHED_DATA_UPDATE_REQUEST } from "../handlers/cachedData";

export default function* cachedDataSaga() {
  yield all([
    takeEvery(CACHED_DATA_UPDATE_REQUEST, handle_CACHED_DATA_UPDATE_REQUEST),
    takeEvery(
      CACHED_DATA_INITIALIZE_REQUEST,
      handle_CACHED_DATA_UPDATE_REQUEST
    ),
  ]);
}

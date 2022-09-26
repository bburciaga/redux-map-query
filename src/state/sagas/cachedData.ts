import { takeEvery } from "redux-saga/effects";
import { CACHED_DATA_UPDATE_SUCCESS } from "../actions";
import { handle_CACHED_DATA_UPDATE_SUCCESS } from "../handlers/cachedData";

export default function* cachedDataSaga() {
  yield takeEvery(CACHED_DATA_UPDATE_SUCCESS, handle_CACHED_DATA_UPDATE_SUCCESS);
}

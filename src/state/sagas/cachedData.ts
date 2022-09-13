import { all, takeEvery } from "redux-saga/effects";
import { CACHED_DATA_UPDATE_REQUEST } from "../actions";

function* handle_CACHED_DATA_UPDATE_REQUEST(action: any) {
  // coolguy
}

export default function* cachedDataSaga() {
  yield all([
    takeEvery(CACHED_DATA_UPDATE_REQUEST, () =>
      console.log("CACHED_DATA_UPDATE_REQUEST")
    ),
  ]);
}

import { actionChannel, call, take } from "redux-saga/effects";
import { CACHED_DATA_REMOVE_FURTHEST_REQUEST, CACHED_DATA_UPDATE_REQUEST } from "../actions";
import { handle_CACHED_DATA_REMOVE_FURTHEST_REQUEST, handle_CACHED_DATA_UPDATE_REQUEST } from "../handlers/cachedData";

function* watch_CACHED_DATA_UPDATE_REQUEST() {
  const requestChan = yield actionChannel(CACHED_DATA_UPDATE_REQUEST);

  while (true) {
    const action = yield take(requestChan);

    yield call(handle_CACHED_DATA_UPDATE_REQUEST, action);
  }
}

function* watch_CACHED_DATA_REMOVE_FURTHEST_REQUEST() {
  const requestChan = yield actionChannel(CACHED_DATA_REMOVE_FURTHEST_REQUEST);

  while (true) {
    const action = yield take(requestChan);

    yield call(handle_CACHED_DATA_REMOVE_FURTHEST_REQUEST, action);
  }
}

export { watch_CACHED_DATA_UPDATE_REQUEST, watch_CACHED_DATA_REMOVE_FURTHEST_REQUEST };

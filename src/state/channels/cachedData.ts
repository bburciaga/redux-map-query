import { actionChannel, call, take } from "redux-saga/effects";
import {
  CACHED_DATA_INITIALIZE_REQUEST,
  CACHED_DATA_UPDATE_REQUEST,
} from "../actions";
import {
  handle_CACHED_DATA_INITIALIZE_REQUEST,
  handle_CACHED_DATA_UPDATE_REQUEST,
} from "../handlers/cachedData";

function* watch_CACHED_DATA_INITIALIZE_REQUEST() {
  const requestChan = yield actionChannel(CACHED_DATA_INITIALIZE_REQUEST);

  while (true) {
    const action = yield take(requestChan);

    yield call(handle_CACHED_DATA_INITIALIZE_REQUEST, action);
  }
}

function* watch_CACHED_DATA_UPDATE_REQUEST() {
  const requestChan = yield actionChannel(CACHED_DATA_UPDATE_REQUEST);

  while (true) {
    const action = yield take(requestChan);

    yield call(handle_CACHED_DATA_UPDATE_REQUEST, action);
  }
}

export {
  watch_CACHED_DATA_INITIALIZE_REQUEST,
  watch_CACHED_DATA_UPDATE_REQUEST,
};

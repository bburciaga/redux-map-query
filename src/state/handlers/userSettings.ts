import { put } from "redux-saga/effects";
import {
  USER_SETTINGS_MOVE_UPDATE_FAIL,
  USER_SETTINGS_MOVE_UPDATE_SUCCESS,
  USER_SETTINGS_ZOOM_LEVEL_UPDATE_FAIL,
  USER_SETTINGS_ZOOM_LEVEL_UPDATE_SUCCESS,
} from "../actions";

export function* handle_USER_SETTINGS_ZOOM_LEVEL_UPDATE_REQUEST(action: any) {
  const { user_bounds, zoom_level } = action.payload;

  try {
    yield put({
      type: USER_SETTINGS_ZOOM_LEVEL_UPDATE_SUCCESS,
      payload: {
        user_bounds: user_bounds,
        zoom_level: zoom_level,
      },
    });
  } catch (error: any) {
    yield put({
      type: USER_SETTINGS_ZOOM_LEVEL_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

export function* handle_USER_SETTINGS_MOVE_UPDATE_REQUEST(action: any) {
  const { user_bounds } = action.payload;

  try {
    yield put({
      type: USER_SETTINGS_MOVE_UPDATE_SUCCESS,
      payload: {
        user_bounds: user_bounds,
      },
    });
  } catch (error: any) {
    yield put({
      type: USER_SETTINGS_MOVE_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

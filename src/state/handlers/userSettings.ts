import { put } from "redux-saga/effects";
import {
  USER_SETTINGS_ZOOM_LEVEL_UPDATE_FAIL,
  USER_SETTINGS_ZOOM_LEVEL_UPDATE_SUCCESS,
} from "../actions";

export function* handle_USER_SETTINGS_ZOOM_LEVEL_UPDATE_REQUEST(action: any) {
  const { zoom_level } = action.payload;

  try {
    yield put({
      type: USER_SETTINGS_ZOOM_LEVEL_UPDATE_SUCCESS,
      payload: {
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

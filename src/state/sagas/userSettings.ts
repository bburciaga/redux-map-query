import { takeEvery } from "redux-saga/effects";
import { USER_SETTINGS_ZOOM_LEVEL_UPDATE_REQUEST } from "../actions";
import { handle_USER_SETTINGS_ZOOM_LEVEL_UPDATE_REQUEST } from "../handlers/userSettings";

export default function* userSettingsSaga() {
  yield takeEvery(
    USER_SETTINGS_ZOOM_LEVEL_UPDATE_REQUEST,
    handle_USER_SETTINGS_ZOOM_LEVEL_UPDATE_REQUEST
  );
}

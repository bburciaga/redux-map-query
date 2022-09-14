import { put, select, takeEvery } from "redux-saga/effects";
import {
  CACHED_DATA_UPDATE_REQUEST,
  CACHED_DATA_UPDATE_SUCCESS,
} from "../actions";

function* handle_CACHED_DATA_UPDATE_REQUEST(action: any) {
  const { new_features, removed_timestamp, old_features } = action.payload;
  try {
    const tempFeatures: any = [];

    if (removed_timestamp !== null || removed_timestamp !== undefined) {
      for (const feature of old_features) {
        if (feature.properties.extent_id !== removed_timestamp) {
          tempFeatures.push(feature);
        }
      }
    }

    yield put({
      type: CACHED_DATA_UPDATE_SUCCESS,
      payload: {
        feature_collection: {
          type: "FeatureCollection",
          features: [...tempFeatures, ...new_features],
        },
      },
    });
  } catch (e) {
    console.log("not a cool guy", e);
  }
}

export default function* cachedDataSaga() {
  yield takeEvery(
    CACHED_DATA_UPDATE_REQUEST,
    handle_CACHED_DATA_UPDATE_REQUEST
  );
}

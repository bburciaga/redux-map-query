import { put, select, takeEvery, throttle } from "redux-saga/effects";
import {
  CACHED_DATA_UPDATE_REQUEST,
  CACHED_DATA_UPDATE_SUCCESS,
  CACHED_DATA_UPDATE_FAIL,
} from "../actions";
import { selectBufferedExtents } from "../reducers/bufferedExtents";
import { selectCachedData } from "../reducers/cachedData";

function* handle_CACHED_DATA_UPDATE_REQUEST(action: any) {
  const { new_features, timestamps, old_features } = action.payload;
  try {
    const cachedData = yield select(selectCachedData);
    console.log("coolest data");
    console.log(cachedData);

    const tempFeatures: any = [];

    if (timestamps !== null || timestamps !== undefined) {
      for (const feature of old_features) {
        for (const timestamp of timestamps) {
          if (feature.properties.extent_id === timestamp) {
            tempFeatures.push(feature);
            break;
          }
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
  } catch (error: any) {
    yield put({
      type: CACHED_DATA_UPDATE_FAIL,
      payload: error,
    });
  }
}

export default function* cachedDataSaga() {
  yield takeEvery(
    CACHED_DATA_UPDATE_REQUEST,
    handle_CACHED_DATA_UPDATE_REQUEST
  );
}

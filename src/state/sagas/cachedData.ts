import { useSelector } from "react-redux";
import { all, put, takeEvery } from "redux-saga/effects";
import {
  CACHED_DATA_UPDATE_REQUEST,
  CACHED_DATA_UPDATE_SUCCESS,
} from "../actions";
import { selectCachedData } from "../reducers/cachedData";

function* handle_CACHED_DATA_UPDATE_REQUEST(action: any) {
  const { new_features, removed_timestamp } = action.payload;
  const cachedData = useSelector(selectCachedData);
  const tempFeatures = cachedData.data.features;

  if (removed_timestamp !== null && removed_timestamp !== undefined) {
    const indexArr: number[] = [];

    for (let i = 0; i < tempFeatures.length; i++) {
      if (tempFeatures[i].properties.extent_id === removed_timestamp) {
        indexArr.push(i);
      }
    }

    for (const index of indexArr) {
      tempFeatures.splice(index, 1);
    }
  }

  yield put({
    type: CACHED_DATA_UPDATE_SUCCESS,
    data: {
      type: "FeatureCollection",
      features: [...tempFeatures, ...new_features],
    },
  });
}

export default function* cachedDataSaga() {
  yield takeEvery(
    CACHED_DATA_UPDATE_REQUEST,
    handle_CACHED_DATA_UPDATE_REQUEST
  );
}

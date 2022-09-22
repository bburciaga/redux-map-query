import { put, select } from "redux-saga/effects";
import { getGeoJSON } from "../../DataBCShapes";
import {
  CACHED_DATA_INITIALIZE_FAIL,
  CACHED_DATA_INITIALIZE_SUCCESS,
  CACHED_DATA_UPDATE_FAIL,
  CACHED_DATA_UPDATE_SUCCESS,
} from "../actions";
import { selectCachedData } from "../reducers/cachedData";

function* handle_CACHED_DATA_INITIALIZE_REQUEST(action: any) {
  const { fetch_geo } = action.payload;

  try {
    const newData: any = [];

    yield getGeoJSON(
      "WHSE_WATER_MANAGEMENT.WLS_WATER_RESERVES_POLY",
      fetch_geo
    ).then((returnVal) => {
      returnVal.features.map((feature: any) => {
        feature.properties.extent_id = fetch_geo.properties.timestamp;
        newData.push(feature);
      });
    });

    yield put({
      type: CACHED_DATA_INITIALIZE_SUCCESS,
      payload: {
        feature_collection: {
          type: "FeatureCollection",
          features: newData,
        },
      },
    });
  } catch (error: any) {
    yield put({
      type: CACHED_DATA_INITIALIZE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function* handle_CACHED_DATA_UPDATE_REQUEST(action: any) {
  const { fetch_geo, timestamps } = action.payload;

  try {
    const newData: any = [];

    yield getGeoJSON(
      "WHSE_WATER_MANAGEMENT.WLS_WATER_RESERVES_POLY",
      fetch_geo
    ).then((returnVal) => {
      returnVal.features.map((feature: any) => {
        feature.properties.extent_id = fetch_geo.properties.timestamp;
        newData.push(feature);
      });
    });

    const cachedData = yield select(selectCachedData);

    const tempFeatures: any = [];

    if (timestamps !== null || timestamps !== undefined) {
      for (const feature of cachedData.data.features) {
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
          features: [...tempFeatures, ...newData],
        },
      },
    });
  } catch (error: any) {
    yield put({
      type: CACHED_DATA_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

export {
  handle_CACHED_DATA_INITIALIZE_REQUEST,
  handle_CACHED_DATA_UPDATE_REQUEST,
};

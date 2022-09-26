import { put, select } from "redux-saga/effects";
import { getGeoJSON } from "../../DataBCShapes";
import { createFeatureCollection } from "../../helpers/geometry";
import {
  CACHED_DATA_INITIALIZE_SUCCESS,
  CACHED_DATA_REMOVE_FURTHEST_FAIL,
  CACHED_DATA_REMOVE_FURTHEST_SUCCESS,
  CACHED_DATA_UPDATE_FAIL,
  CACHED_DATA_UPDATE_SUCCESS,
} from "../actions";
import { selectCachedData } from "../reducers/cachedData";

function* handle_CACHED_DATA_UPDATE_REQUEST(action: any) {
  const { fetch_geo, initialize } = action.payload;

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

    if (!initialize) {
      yield put({
        type: CACHED_DATA_UPDATE_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection([...cachedData.data.features, ...newData]),
          count: cachedData.count + 1,
        },
      });
    } else {
      yield put({
        type: CACHED_DATA_INITIALIZE_SUCCESS,
        payload: {
          feature_collection: createFeatureCollection(newData),
          count: cachedData.count + 1,
        },
      });
    }
  } catch (error: any) {
    yield put({
      type: CACHED_DATA_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function* handle_CACHED_DATA_REMOVE_FURTHEST_REQUEST(action: any) {
  const { timestamps } = action.payload;
  const cachedData = yield select(selectCachedData);
  
  const updatedFeatures: any = [];

  if (timestamps !== null || timestamps !== undefined) {
    for (const feature of cachedData.data.features) {
      for (const timestamp of timestamps) {
        if (feature.properties.extent_id === timestamp) {
          updatedFeatures.push(feature);
          break;
        }
      }
    }
  }

  try {
    yield put({
      type: CACHED_DATA_REMOVE_FURTHEST_SUCCESS,
      payload: {
        feature_collection: createFeatureCollection(updatedFeatures),
        count: cachedData.count + 1
      }
    });
  } catch (error: any) {
    yield put({
      type: CACHED_DATA_REMOVE_FURTHEST_FAIL,
      payload: {
        error: error
      }
    });
  }
}

export { handle_CACHED_DATA_UPDATE_REQUEST };

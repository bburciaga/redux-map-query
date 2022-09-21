import {
  CACHED_DATA_INITIALIZE_FAIL,
  CACHED_DATA_INITIALIZE_SUCCESS,
  CACHED_DATA_UPDATE_FAIL,
  CACHED_DATA_UPDATE_SUCCESS,
} from "../actions";

export class CachedDataState {
  initialized: boolean;
  data: any;

  constructor() {
    this.initialized = false;
    this.data = {
      type: "FeatureCollection",
      features: [],
    };
  }
}
const initialState = new CachedDataState();

function createCachedDataReducer(): (
  CachedDataState: any,
  AnyAction: any
) => CachedDataState {
  return (state = initialState, action) => {
    switch (action.type) {
      case CACHED_DATA_INITIALIZE_SUCCESS: {
        return {
          ...state,
          initialized: true,
          data: action.payload.feature_collection,
        };
      }
      case CACHED_DATA_UPDATE_SUCCESS: {
        return {
          ...state,
          data: action.payload.feature_collection,
        };
      }
      case CACHED_DATA_INITIALIZE_FAIL:
      case CACHED_DATA_UPDATE_FAIL: {
        return {
          ...state,
          error: action.payload.error,
        };
      }
      default:
        return state;
    }
  };
}

const selectCachedData: (state: any) => CachedDataState = (state) =>
  state.cachedData;

export { createCachedDataReducer, selectCachedData };

import { CACHED_DATA_UPDATE_SUCCESS } from "../actions";

class CachedDataState {
  initialized: boolean;
  data: null;

  constructor() {
    this.initialized = false;
    this.data = null;
  }
}
const initialState = new CachedDataState();

function createCachedDataReducer(): (
  CachedDataState: any,
  AnyAction: any
) => CachedDataState {
  return (state = initialState, action) => {
    switch (action.type) {
      case CACHED_DATA_UPDATE_SUCCESS: {
        return {
          ...state,
          data: {
            type: "FeatureCollection",
            data: action.payload.features,
          },
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

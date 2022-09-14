import {
  BUFFERED_EXTENTS_INITIALIZE,
  BUFFERED_EXTENTS_UPDATE_SUCCESS,
} from "../actions";

class BufferedExtentsState {
  initialized: boolean;
  data: any;
  count: number;

  constructor() {
    this.initialized = false;
    this.data = null;
    this.count = 0;
  }
}
const initialState = new BufferedExtentsState();

function createBufferedExtentsReducer(): (
  BufferedExtentsState: any,
  AnyAction: any
) => BufferedExtentsState {
  return (state = initialState, action) => {
    switch (action.type) {
      case BUFFERED_EXTENTS_INITIALIZE: {
        return {
          ...state,
          initialized: true,
          data: {
            type: "FeatureCollection",
            features: action.payload.extents,
          },
          count: action.payload.count,
        };
      }
      case BUFFERED_EXTENTS_UPDATE_SUCCESS: {
        return {
          ...state,
          data: {
            type: "FeatureCollection",
            features: action.payload.features,
          },
          count: action.payload.count,
        };
      }
      default:
        return state;
    }
  };
}

const selectBufferedExtents: (state: any) => BufferedExtentsState = (state) =>
  state.bufferedExtents;

export { createBufferedExtentsReducer, selectBufferedExtents };

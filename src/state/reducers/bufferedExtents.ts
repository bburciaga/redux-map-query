import { BUFFERED_EXTENTS_INITIALIZE, BUFFERED_EXTENTS_UPDATE_SUCCESS } from "../actions";

class BufferedExtentsState {
  initialized: boolean;
  data: any;

  constructor() {
    this.initialized = false;
    this.data = null;
  }
}
const initialState = new BufferedExtentsState();

function createBufferedExtentsReducer(): (
  BufferedExtentState: any,
  AnyAction: any
) => BufferedExtentsState {
  return (state = initialState, action) => {
    switch (action.type) {
      case BUFFERED_EXTENTS_INITIALIZE: {
        return {
          ...state,
          initialized: true,
          data: {
            type: 'FeatureCollection',
            features: [
              action.payload.extentGeoJSON
            ]
          }
        }
      }
      case BUFFERED_EXTENTS_UPDATE_SUCCESS: {
        console.log('succeeding');
        return {
          ...state,
          data: {
            type: 'FeatureCollection',
            features: action.payload.extents
          }
        }
      }
      default:
        return state;
    }
  };
}

const selectBufferedExtents: (state: any) => BufferedExtentsState = (state) =>
  state.bufferedExtents;

export { createBufferedExtentsReducer, selectBufferedExtents };

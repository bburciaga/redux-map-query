import { BUFFERED_EXTENTS_INITIALIZE } from "../actions";

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
              action.payload.feature
            ]
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

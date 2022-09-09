class BufferedExtentState {
  initialized: boolean;
  data: any;

  constructor() {
    this.initialized = false;
    this.data = null;
  }
}
const initialState = new BufferedExtentState();

function createBufferedExtentReducer(): (
  BufferedExtentState: any,
  AnyAction: any
) => BufferedExtentState {
  return (state = initialState, action) => {
    switch (action.type) {
      default:
        return state;
    }
  };
}

const selectBufferedExtent: (state: any) => BufferedExtentState = (state) =>
  state.bufferedExtent;

export { createBufferedExtentReducer, selectBufferedExtent };

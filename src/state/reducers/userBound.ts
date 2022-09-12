import {
  USER_BOUND_INITIALIZE,
  USER_BOUND_UPDATE_ON_MOVE,
  USER_BOUND_UPDATE_ON_ZOOM,
} from "../actions";

class UserBoundState {
  initialized: boolean;
  data: any;

  constructor() {
    this.initialized = false;
    this.data = null;
  }
}
const initialState = new UserBoundState();

function createUserBoundReducer(): (
  UserBoundState: any,
  AnyAction: any
) => UserBoundState {
  return (state = initialState, action) => {
    switch (action.type) {
      case USER_BOUND_INITIALIZE: {
        return {
          ...state,
          initialized: true,
          data: action.payload.userGeoJSON,
        };
      }
      case USER_BOUND_UPDATE_ON_MOVE:
      case USER_BOUND_UPDATE_ON_ZOOM: {
        return {
          ...state,
          data: action.payload.userGeoJSON,
        };
      }
      default:
        return state;
    }
  };
}

const selectUserBound: (state: any) => UserBoundState = (state) =>
  state.userBound;

export { createUserBoundReducer, selectUserBound };

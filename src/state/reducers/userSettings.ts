import {
  USER_SETTINGS_INITIALIZE,
  USER_SETTINGS_MOVE_UPDATE_FAIL,
  USER_SETTINGS_MOVE_UPDATE_SUCCESS,
  USER_SETTINGS_ZOOM_LEVEL_UPDATE_FAIL,
  USER_SETTINGS_ZOOM_LEVEL_UPDATE_SUCCESS,
} from "../actions";

class UserSettingsState {
  initialized: boolean;
  error: any;

  zoom_level: number;
  user_bounds: any;

  constructor() {
    this.initialized = false;
    this.error = null;

    this.zoom_level = 5;
    this.user_bounds = null;
  }
}
const initialState = new UserSettingsState();

function createUserSettingsReducer(): (
  UserSettingsState: any,
  AnyAction: any
) => UserSettingsState {
  return (state = initialState, action) => {
    switch (action.type) {
      case USER_SETTINGS_INITIALIZE: {
        return {
          ...state,
          initialized: true,
          zoom_level: action.payload.zoom_level,
          user_bounds: action.payload.user_bounds,
        };
      }
      case USER_SETTINGS_ZOOM_LEVEL_UPDATE_SUCCESS: {
        return {
          ...state,
          zoom_level: action.payload.zoom_level,
          user_bounds: action.payload.user_bounds,
        };
      }
      case USER_SETTINGS_MOVE_UPDATE_SUCCESS: {
        return {
          ...state,
          user_bounds: action.payload.user_bounds,
        };
      }
      case USER_SETTINGS_MOVE_UPDATE_FAIL:
      case USER_SETTINGS_ZOOM_LEVEL_UPDATE_FAIL: {
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

const selectUserSettings: (state: any) => UserSettingsState = (state) =>
  state.userSettings;

export { createUserSettingsReducer, selectUserSettings };

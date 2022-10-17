import {
  USER_SETTINGS_INITIALIZE,
  USER_SETTINGS_ZOOM_LEVEL_UPDATE_FAIL,
  USER_SETTINGS_ZOOM_LEVEL_UPDATE_SUCCESS,
} from "../actions";

class UserSettingsState {
  initialized: boolean;
  error: any;

  zoom_level: number;

  constructor() {
    this.initialized = false;
    this.error = null;

    this.zoom_level = 5;
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
        };
      }
      case USER_SETTINGS_ZOOM_LEVEL_UPDATE_SUCCESS: {
        return {
          ...state,
          zoom_level: action.payload.zoom_level,
        };
      }
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

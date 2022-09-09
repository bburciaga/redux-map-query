import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "@reduxjs/toolkit";
import { createUserBoundReducer } from "./state/reducers/userBound";
import logger from "redux-logger";
import { createBufferedExtentReducer } from "./state/reducers/bufferedExtent";

export const setupStore = () => {
  const store = createStore(
    combineReducers({
      userBound: createUserBoundReducer(),
      bufferedExtent: createBufferedExtentReducer(),
    }),
    applyMiddleware(logger)
  );

  return store;
};

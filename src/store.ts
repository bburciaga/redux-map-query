import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "@reduxjs/toolkit";
import { createUserBoundReducer } from "./state/reducers/userBound";
import logger from "redux-logger";
import { createBufferedExtentsReducer } from "./state/reducers/bufferedExtent";

export const setupStore = () => {
  const store = createStore(
    combineReducers({
      userBound: createUserBoundReducer(),
      bufferedExtents: createBufferedExtentsReducer(),
    }),
    applyMiddleware(logger)
  );

  return store;
};

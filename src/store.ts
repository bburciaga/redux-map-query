import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "@reduxjs/toolkit";
import { createUserBoundReducer } from "./state/reducers/userBound";
import logger from "redux-logger";
import { createBufferedExtentsReducer } from "./state/reducers/bufferedExtent";
import createSagaMiddleware from "@redux-saga/core";

export const setupStore = () => {
  // const sagaMiddleware = createSagaMiddleware();

  const middlewares = applyMiddleware(logger);

  const store = createStore(
    combineReducers({
      userBound: createUserBoundReducer(),
      bufferedExtents: createBufferedExtentsReducer(),
    }),
    middlewares
  );

  return store;
};

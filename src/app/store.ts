import {
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';

import rootReducer, {
  rootEpic,
  RootState,
} from './rootReducer';
import { createEpicMiddleware } from 'redux-observable';
import { Action } from 'redux';

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), epicMiddleware],
});

epicMiddleware.run(rootEpic);

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export type AppDispatch = typeof store.dispatch;
export default store;


import { configureStore, combineReducers } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import authReducer from './authSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from './storage';

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['user', 'isAuthenticated'],
};

const uiPersistConfig = {
  key: 'ui',
  storage: storage,
  whitelist: ['expanded'],
};

const rootReducer = combineReducers({
  ui: persistReducer(uiPersistConfig, uiReducer),
  auth: persistReducer(authPersistConfig, authReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

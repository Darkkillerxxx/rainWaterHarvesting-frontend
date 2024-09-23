import { configureStore } from '@reduxjs/toolkit';
import picklistValuesReducer from '../features/picklistValuesSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';  // Defaults to localStorage for web
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage
}

const rootReducer = combineReducers({
  items: picklistValuesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disables warnings for non-serializable data
    }),
});

export const persistor = persistStore(store);

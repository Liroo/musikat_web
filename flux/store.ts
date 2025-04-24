import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";

import listenerMiddleware from "@/flux/listenerMiddleware";
import noteGuessrSlice from "@/flux/noteguessr/reducer";
import settingsSlice from "@/flux/settings/reducer";
import statusSlice from "@/flux/status/reducer";
import storage from "@/flux/storage";
import toastSlice from "@/flux/toast/reducer";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

export const makeStore = () => {
  const rootReducer = combineReducers({
    [statusSlice.name]: statusSlice.reducer,
    [toastSlice.name]: toastSlice.reducer,
    [noteGuessrSlice.name]: noteGuessrSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
  });

  const persistConfig = {
    key: "musikat-root",
    version: 1,
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: [noteGuessrSlice.name, settingsSlice.name],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const persistedReducer = persistReducer(persistConfig as any, rootReducer);

  const store = configureStore({
    devTools: process.env.EXPO_PUBLIC_ENV !== "production",
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          ignoredPaths: [/^modal\..*/],
        },
      }).prepend(listenerMiddleware.middleware),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (store as any).__persisitor = persistStore(store);

  return store as typeof store & {
    __persisitor: ReturnType<typeof persistStore>;
  };
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

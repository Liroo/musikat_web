import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectSettingsReducer = (state: RootState) => state.settings;

export const selectSettingsNotation = createSelector(
  [selectSettingsReducer],
  (settingsReducer) => settingsReducer.notation
);

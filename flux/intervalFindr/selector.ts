import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectIntervalFindrReducer = (state: RootState) => state.intervalFindr;

export const selectIntervalFindrSettings = createSelector(
  [selectIntervalFindrReducer],
  (intervalFindrReducer) => intervalFindrReducer.settings
);

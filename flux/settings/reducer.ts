import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { SettingsNotation } from "@/flux/settings/type";
import { resetStore } from "../action";

export type SettingsState = {
  notation: SettingsNotation;
};

const initialState: SettingsState = {
  notation: "eu",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    settingsSetNotation: (state, action: PayloadAction<SettingsNotation>) => {
      state.notation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetStore, () => initialState);
  },
});

export const { settingsSetNotation } = settingsSlice.actions;

export default settingsSlice;

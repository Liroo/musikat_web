import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IntervalFindrSettings } from "@/flux/intervalFindr/type";
import { resetStore } from "../action";

export type IntervalFindrState = {
  settings: IntervalFindrSettings;
  averageTime: {
    [id: string]: number[];
  };
};

const initialState: IntervalFindrState = {
  settings: {
    wantToFind: "note",
    allowedInvertedInterval: false,
    allowedInterval: ["m3", "M3", "P5", "m7", "M7"],
  },
  averageTime: {},
};

const intervalFindrSlice = createSlice({
  name: "intervalFindr",
  initialState,
  reducers: {
    intervalFindrSetSettings: (
      state,
      action: PayloadAction<IntervalFindrSettings>
    ) => {
      state.settings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetStore, () => initialState);
  },
});

export const { intervalFindrSetSettings } = intervalFindrSlice.actions;

export default intervalFindrSlice;

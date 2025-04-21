import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { resetStore } from "../action";
import { Toast } from "./type";

export type ToastState = { [id: string]: Toast };

const initialState: ToastState = {};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: {
      reducer: (state, action: PayloadAction<Toast>) => {
        state[action.payload.id as string] = action.payload;
      },
      prepare: (toast: Toast) => {
        return {
          payload: {
            createdAt: new Date().getTime(),
            id: Math.random().toString(36).substring(2, 9),
            ...toast,
          },
        };
      },
    },
    removeToast: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    removeAllToast: () => {
      return {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetStore, () => initialState);
  },
});

export const { addToast, removeToast, removeAllToast } = toastSlice.actions;

export default toastSlice;

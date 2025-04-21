import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Toast } from "./type";

const selectToastReducer = (state: RootState) => state.toast;

export const selectToastList = createSelector(
  [selectToastReducer],
  (toastReducer) => {
    const keys = Object.keys(toastReducer);

    return keys
      .map((id: string) => toastReducer[id])
      .sort(
        (toastA: Toast, toastB: Toast) =>
          (toastB.createdAt as number) - (toastA.createdAt as number)
      );
  }
);

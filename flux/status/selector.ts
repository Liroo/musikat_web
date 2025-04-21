import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { StatusEnum } from "./type";

const idleStatus = {
  status: StatusEnum.Idle,
  error: null,
};

const selectStatusReducer = (state: RootState) => state.status;

export const selectStatusByActionTypeId = (
  actionType: string,
  id: string = "default"
) =>
  createSelector([selectStatusReducer], (statusReducer) => {
    const status = statusReducer[actionType]?.[id] ?? idleStatus;
    return {
      ...status,
      isLoading: status.status === StatusEnum.Pending,
      isLoadingOrIdle:
        status.status === StatusEnum.Pending ||
        status.status === StatusEnum.Idle,
      isSuccess: status.status === StatusEnum.Fulfilled,
      isIdle: status.status === StatusEnum.Idle,
      isFail: status.status === StatusEnum.Rejected,
    };
  });

export const selectStatusByActionTypeIsLoading = (
  actionType: string,
  key: string = ""
) =>
  createSelector([selectStatusReducer], (statusReducer) => {
    if (key)
      return statusReducer[actionType]?.[key]?.status === StatusEnum.Pending;
    return Object.keys(statusReducer[actionType] ?? []).some(
      (key) => statusReducer[actionType][key].status === StatusEnum.Pending
    );
  });

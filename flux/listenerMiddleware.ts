/* eslint-disable @typescript-eslint/no-explicit-any */
import { createListenerMiddleware, isRejected } from "@reduxjs/toolkit";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isRejected,
  effect: async (action) => {
    const arg: any = {};
    if (action.meta.arg) {
      Object.keys(action.meta.arg).forEach((key) => {
        if (
          ["string", "number", "boolean", "null"].includes(
            (typeof (action.meta.arg as any)[key]).toLowerCase()
          )
        )
          arg[key] = (action.meta.arg as any)[key];
        else arg[key] = JSON.stringify((action.meta.arg as any)[key]);
      });
    }
  },
});

export default listenerMiddleware;

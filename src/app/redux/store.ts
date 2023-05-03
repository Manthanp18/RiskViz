import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./feature/dataSlice";
import counterReducer from "./feature/counterSlice";


export const store = configureStore({
  reducer: {
    counterReducer,
    dataReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

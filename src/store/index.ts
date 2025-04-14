// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
// import exampleReducer from './exampleSlice';

export const store = configureStore({
  reducer: {
    // example: exampleReducer,
  },
});

// 타입 추론용 (useSelector, useDispatch에서 사용)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

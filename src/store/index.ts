import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// 타입 추론용 (useSelector, useDispatch에서 사용)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginWithSocial: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      localStorage.removeItem('accessToken');
    },
  },
});

export const { loginWithSocial, logout } = authSlice.actions;
export default authSlice.reducer;

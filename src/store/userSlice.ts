import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null; // 이메일 (social login id)
  nickname: string | null; // 유저 닉네임
  isLoggedIn: boolean; // 로그인 여부
}

const initialState: UserState = {
  id: null,
  nickname: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ id: string; nickname: string }>,
    ) => {
      state.id = action.payload.id;
      state.nickname = action.payload.nickname;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.id = null;
      state.nickname = null;
      state.isLoggedIn = false;
    },

    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoggedIn } = userSlice.actions;

export default userSlice.reducer;

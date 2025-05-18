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
    // ✅ 유저 정보 저장 (닉네임 등록 시 호출됨)
    setUser: (
      state,
      action: PayloadAction<{ id: string; nickname: string }>,
    ) => {
      state.id = action.payload.id;
      state.nickname = action.payload.nickname;
      state.isLoggedIn = true;
    },

    // ✅ 로그아웃 또는 유저 정보 초기화
    clearUser: (state) => {
      state.id = null;
      state.nickname = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

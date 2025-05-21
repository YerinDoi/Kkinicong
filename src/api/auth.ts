import axios from './axiosInstance';

type LoginType = 'KAKAO' | 'NAVER' | 'GOOGLE';

// code: redirect URI에서 받은 인증 코드
export const login = async (loginType: LoginType, code: string) => {
  const response = await axios.get(`/auth/login/${loginType}`, {
    params: { code }, // 👈 쿼리 파라미터로 전달
  });

  const accessToken = response.data.results.accessToken;

  // accessToken 저장
  localStorage.setItem('accessToken', accessToken);

  return response.data.results;
};

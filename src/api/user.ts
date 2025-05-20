import axios from './axiosInstance';

/**
 * 닉네임 중복 확인 API
 * @param nickname 확인할 닉네임
 * @returns true → 중복 있음 / false → 사용 가능
 */
export const checkNicknameDuplicate = async (
  nickname: string,
): Promise<boolean> => {
  const res = await axios.get('/user/check-nickname', {
    params: { nickname },
  });
  return res.data.exists; // 👈 백엔드 응답 형식에 따라 조정
};

/**
 * 닉네임 등록 API
 * @param nickname 저장할 닉네임
 * @returns 등록된 유저 정보 (예: id, nickname)
 */
export const registerNickname = async (nickname: string) => {
  const res = await axios.post('/user/nickname', { nickname });
  return res.data.results; // 👈 CallbackPage나 Redux에서 쓰이는 유저 정보 반환
};

import axios from './axiosInstance';

/**
 * 닉네임 중복 확인 API
 * @param nickname 확인할 닉네임
 * @returns true → 중복 있음 / false → 사용 가능
 */
export const checkNicknameDuplicate = async (
  nickname: string,
): Promise<boolean> => {
  const res = await axios.get('/api/v1/user/check-nickname', {
    params: { nickname },
  });
  console.log('중복 확인???' + res.data.results);
  return res.data.results;
};

/**
 * 닉네임 등록 API
 * @param nickname 저장할 닉네임
 * @returns 등록된 유저 정보 (예: id, nickname)
 */
export const registerNickname = async (nickname: string) => {
  const res = await axios.post('/api/v1/user/nickname', { nickname });
  console.log('👉 nickname:', res.data.results.nickname); // 핵심 확인
  return res.data.results;
};

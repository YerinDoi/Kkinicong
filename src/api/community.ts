import axios from '@/api/axiosInstance';

export interface CommunityPostPayload {
  title: string;
  content: string;
  category: string; // 'WELFARE_INFO' | ... 형태 문자열
}

export const postCommunity = async (data: CommunityPostPayload) => {
  const res = await axios.post('/api/v1/community/post', data);
  return res.data.results; // communityPostId 반환
};

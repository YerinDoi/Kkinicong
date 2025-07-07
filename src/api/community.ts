import axios from '@/api/axiosInstance';

export const labelToValueMap = {
  '복지정보': 'WELFARE_INFO',
  '잡담해요': 'CHITCHAT',
  '양육/육아': 'PARENTING',
  '문의/도움': 'QUESTION_HELP',
  '생활꿀팁': 'LIFE_TIP',
  '칭찬/감사': 'APPRECIATION',
  '기타': 'ETC',
};


export interface CommunityPostPayload {
  title: string;
  content: string;
  category: string; // 'WELFARE_INFO' | ... 형태 문자열
  imageUrls: string[];
}
//게시글 등록
export const postCommunity = async (data: CommunityPostPayload) => {
  const res = await axios.post('/api/v1/community/post', data);
  return res.data.results;
};


//게시글 수정
export const patchCommunity = async (postId: string, data: CommunityPostPayload) => {
  const res = await axios.patch(`/api/v1/community/post/${postId}`, data);
  return res.data.results;
};


// src/api/convenience.ts
import axios from '@/api/axiosInstance';
import { toServerCategory, toServerBrand } from '@/utils/convenienceMapper';

// 상품 목록 조회
export const fetchConvenienceProducts = async ({
  keyword,
  category,
  brand,
  isAvailableCheck,
  page,
  size,
}: {
  keyword?: string;
  category?: string;
  brand?: string;
  isAvailableCheck?: boolean;
  page: number;
  size: number;
}) => {
  const params: any = {
    page,
    size,
  };

  // 조건에 맞을 때만 보내기
  if (keyword) params.keyword = keyword;
  if (category && category !== '전체')
    params.category = toServerCategory(category);
  if (brand) params.brand = toServerBrand(brand);
  if (isAvailableCheck) params.isAvailableCheck = true;

  const res = await axios.get('/api/v1/convenience/list', { params });
  console.log(res.data.results.content);
  console.log('[응답]', res.data.results);
  console.log('[타입]', typeof res.data.results);
  return res.data.results.content;
};

// 상품 등록
export const createConveniencePost = async (productData: {
  name: string;
  brand: string;
  category: string;
  description: string;
  isAvailable: boolean;
}) => {
  const res = await axios.post('/api/v1/convenience/post', productData);
  return res.data.results.convenienceId;
};

// 상품 삭제 API
export const deleteConveniencePost = async (postId: number) => {
  const res = await axios.delete(`/api/v1/convenience/post/${postId}`);
  return res.data;
};

// 상품 상세 조회 API
export const fetchConvenienceDetail = async (postId: number) => {
  const response = await axios.get(`/api/v1/convenience/post/${postId}`);
  return response.data.results;
};

// 상품 피드백(올바른 정보 / 잘못된 정보) 제출 API
/**
 * @param postId 게시글 ID
 * @param isCorrect true면 올바른 정보, false면 잘못된 정보
 */
export const submitPostFeedback = async (
  postId: number,
  isCorrect: boolean,
): Promise<{
  correctCount: number;
  incorrectCount: number;
  userSelection: boolean;
}> => {
  const response = await axios.post(`/api/v1/convenience/post/${postId}/info`, {
    isCorrect,
  });

  return response.data.results;
};

// 제품명 추천 API
export const fetchProductNameRecommendations = async (productName: string) => {
  const response = await axios.get('/api/v1/convenience/recommendation', {
    params: { productName },
  });
  return response.data.results.content; // 추천 문자열 배열
};

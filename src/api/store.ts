// api/store.ts
import axios from '@/api/axiosInstance';

// 메인화면 가맹점 개수 조회 API
export const getRegionCount = async () => {
  const res = await axios.get('/api/v1/store/region-count');
  return res.data.results.count as number;
};
import { useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';

export const DEFAULT_LOCATION = { latitude: 37.495472, longitude: 126.676902 }; // 인천 서구청

const getLocationFromManualStorage = async () => {
  const stored = localStorage.getItem('manualLocation');
  if (!stored) return null;

  const { city, district } = JSON.parse(stored);
  try {
    const res = await axiosInstance.get('/api/v1/user/place');
    const match = res.data.results.find(
      (item: { city: string; district: string }) =>
        item.city === city && item.district === district,
    );
    if (match) return { latitude: match.latitude, longitude: match.longitude };
  } catch (e) {
    console.error('즐겨찾는 지역 로딩 실패', e);
  }
  return null;
};

/**
 * 위경도를 기준으로 가맹점 데이터를 요청하되, fallback 여부도 설정 가능
 */
export function useGetLocation(
  isGpsActive: boolean,
  gpsLocation: { latitude: number; longitude: number } | null,
  useFallback = false,
) {
  const fetchStores = useCallback(
    async (
      apiPath: string, // ex: '/api/v1/store/top'
      setData: (stores: any[]) => void,
    ) => {
      // 1. 위경도 결정
      const location =
        (isGpsActive && gpsLocation) ||
        (await getLocationFromManualStorage()) ||
        DEFAULT_LOCATION;

      // 2. API 호출
      const res = await axiosInstance.get(apiPath, {
        params: location,
      });

      // 3. fallback 조건 확인
      if (useFallback && res.data?.results?.length === 0) {
        const fallbackRes = await axiosInstance.get(apiPath, {
          params: DEFAULT_LOCATION,
        });
        setData(fallbackRes.data?.results ?? []);
      } else {
        setData(res.data?.results ?? []);
      }
    },
    [isGpsActive, gpsLocation, useFallback],
  );

  return { fetchStores };
}

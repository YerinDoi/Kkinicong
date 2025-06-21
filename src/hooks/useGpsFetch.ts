import { useCallback } from 'react';

/**
 * GPS 버튼 클릭 시 최신 위경도로 fetchStores를 호출하는 공통 훅
 * @param fetchStores (lat, lng) => void : 위경도를 받아서 리스트를 새로고침하는 함수
 * @param requestGps (cb) => void : GPS 위치를 받아오는 함수 (cb로 lat, lng를 반환)
 */
export function useGpsFetch(
  fetchStores: (lat: number, lng: number) => void,
  requestGps: (cb: (lat: number, lng: number) => void) => void,
) {
  const handleGpsClick = useCallback(() => {
    requestGps((lat, lng) => {
      fetchStores(lat, lng);
    });
  }, [fetchStores, requestGps]);

  return handleGpsClick;
}

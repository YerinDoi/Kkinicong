import KakaoMap from '@/components/common/KakaoMap';
import { Store } from '@/types/store';
import { useMemo } from 'react';

interface StoreMapProps {
  stores: Store[];
  center: { lat: number; lng: number }; // 지도 중심 좌표
  level: number; // 지도 확대 레벨
  onMapChange?: (center: { lat: number; lng: number }, level: number) => void; // 통합된 지도 변경 핸들러
  onMarkerClick?: (marker: { lat: number; lng: number; name: string }) => void; // 마커 클릭 핸들러 추가
}

const StoreMap = ({
  stores,
  center,
  level,
  onMapChange,
  onMarkerClick,
}: StoreMapProps) => {
  console.log('받은 stores 데이터:', stores); // 디버깅용 로그 추가

  const markers = useMemo(
    () =>
      stores.map((store) => ({
        lat: store.latitude,
        lng: store.longitude,
        name: store.name,
      })),
    [stores],
  );

  console.log('마커 데이터:', markers); // 디버깅용 로그 추가

  // 가게들의 평균 위경도 계산 (이 로직은 StoreMapPage로 이동)
  // const center = useMemo(() => {
  //   if (stores.length === 0) {
  //     return { lat: 37.494589, lng: 126.868346 }; // 기본 중심 좌표
  //   }

  //   const totalLat = stores.reduce((sum, store) => sum + store.latitude, 0);
  //   const totalLng = stores.reduce((sum, store) => sum + store.longitude, 0);

  //   return {
  //     lat: totalLat / stores.length,
  //     lng: totalLng / stores.length,
  //   };
  // }, [stores]);

  return (
    <div className="w-full h-full">
      <KakaoMap
        center={center}
        markers={markers}
        level={level}
        onMapChange={onMapChange}
        onMarkerClick={onMarkerClick}
      />
    </div>
  );
};

export default StoreMap;

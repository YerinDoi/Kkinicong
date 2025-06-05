import KakaoMap from '@/components/common/KakaoMap';
import { Store } from '@/types/store';
import { useMemo } from 'react';

interface StoreMapProps {
  stores: Store[];
}

const StoreMap = ({ stores }: StoreMapProps) => {
  console.log('받은 stores 데이터:', stores); // 디버깅용 로그 추가

  const markers = useMemo(
    () =>
      stores.map((store) => ({
        lat: store.latitude,
        lng: store.longitude,
      })),
    [stores],
  );

  console.log('마커 데이터:', markers); // 디버깅용 로그 추가

  // 가게들의 평균 위경도 계산
  const center = useMemo(() => {
    if (stores.length === 0) {
      return { lat: 37.494589, lng: 126.868346 }; // 기본 중심 좌표
    }

    const totalLat = stores.reduce((sum, store) => sum + store.latitude, 0);
    const totalLng = stores.reduce((sum, store) => sum + store.longitude, 0);

    return {
      lat: totalLat / stores.length,
      lng: totalLng / stores.length,
    };
  }, [stores]);

  return (
    <div className="w-full h-[224px]">
      <KakaoMap
        center={center}
        markers={markers}
        level={3} // 적절한 초기 줌 레벨
      />
    </div>
  );
};

export default StoreMap;

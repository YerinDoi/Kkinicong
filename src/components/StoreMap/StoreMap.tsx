import KakaoMap, {
  MARKER,
  MARKER_IMAGE_SIZE,
  DOT_MARKER,
  DOT_IMAGE_SIZE,
} from '@/components/common/KakaoMap';
import { Store } from '@/types/store';
import React, { useMemo, useEffect, useState } from 'react';
import { MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';

interface StoreMapProps {
  stores: Store[];
  latestBatchStores: Store[];
  center: { lat: number; lng: number }; // 지도 중심 좌표
  level: number; // 지도 확대 레벨
  onMapChange?: (center: { lat: number; lng: number }, level: number) => void; // 통합된 지도 변경 핸들러
  onMarkerClick?: (marker: { lat: number; lng: number; name: string }) => void; // 마커 클릭 핸들러 추가
  onMapClick?: () => void; // 지도 빈 곳 클릭 핸들러 추가
  onMapLoad?: (map: any) => void; // 지도 인스턴스 전달
}

const StoreMap = ({
  stores,
  latestBatchStores,
  center,
  level,
  onMapChange,
  onMarkerClick,
  onMapClick,
  onMapLoad,
}: StoreMapProps) => {
  console.log('받은 stores 데이터:', stores); // 디버깅용 로그 추가

  // KakaoMap 인스턴스 저장
  const [mapInstance, setMapInstance] = useState<any>(null);

  // center prop이 바뀔 때마다 지도 인스턴스의 setCenter를 직접 호출
  useEffect(() => {
    if (mapInstance && window.kakao && window.kakao.maps) {
      const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
      mapInstance.setCenter(newCenter);
    }
  }, [center.lat, center.lng, mapInstance]);

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
    <div className="w-full h-full" onClick={onMapClick}>
      <KakaoMap
        center={center}
        level={level}
        onMapChange={onMapChange}
        onMapLoad={(map) => {
          setMapInstance(map);
          if (onMapLoad) onMapLoad(map);
        }}
      >
        {stores.map((store) => {
          const isDot = !latestBatchStores.some(
            (latest) => latest.id === store.id,
          );
          const markerPosition = { lat: store.latitude, lng: store.longitude };

          if (isDot) {
            // 점 마커 (이름 없음)
            return (
              <MapMarker
                key={`dot-marker-${store.id}`}
                position={markerPosition}
                image={{
                  src: DOT_MARKER,
                  size: {
                    width: DOT_IMAGE_SIZE.width,
                    height: DOT_IMAGE_SIZE.height,
                  },
                  options: {
                    offset: {
                      x: DOT_IMAGE_SIZE.width / 2,
                      y: DOT_IMAGE_SIZE.height / 2,
                    },
                  },
                }}
                onCreate={(markerInstance) => {
                  if (window.kakao) {
                    window.kakao.maps.event.addListener(
                      markerInstance,
                      'click',
                      (e: any) => {
                        if (e && e.domEvent) e.domEvent.stopPropagation();
                        onMarkerClick &&
                          onMarkerClick({
                            lat: store.latitude,
                            lng: store.longitude,
                            name: store.name,
                          });
                      },
                    );
                  }
                }}
                zIndex={50}
              />
            );
          }
          // 핀 마커 (이름 포함)
          return (
            <React.Fragment key={`pin-group-${store.id}`}>
              <MapMarker
                key={`pin-marker-${store.id}`}
                position={markerPosition}
                image={{
                  src: MARKER,
                  size: {
                    width: MARKER_IMAGE_SIZE.width,
                    height: MARKER_IMAGE_SIZE.height,
                  },
                  options: {
                    offset: {
                      x: MARKER_IMAGE_SIZE.width / 2,
                      y: MARKER_IMAGE_SIZE.height,
                    },
                  },
                }}
                onCreate={(markerInstance) => {
                  if (window.kakao) {
                    window.kakao.maps.event.addListener(
                      markerInstance,
                      'click',
                      (e: any) => {
                        if (e && e.domEvent) e.domEvent.stopPropagation();
                        onMarkerClick &&
                          onMarkerClick({
                            lat: store.latitude,
                            lng: store.longitude,
                            name: store.name,
                          });
                      },
                    );
                  }
                }}
                zIndex={100}
              />
              <CustomOverlayMap
                key={`pin-overlay-${store.id}`}
                position={markerPosition}
                yAnchor={1.3}
                xAnchor={0.5}
                zIndex={101}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#65CE58',
                    backgroundColor: 'white',
                    padding: '4px 8px',
                    borderRadius: '5px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'auto',
                    transform: 'translateY(-100%)',
                    textAlign: 'center',
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                  }}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    onMarkerClick &&
                      onMarkerClick({
                        lat: store.latitude,
                        lng: store.longitude,
                        name: store.name,
                      });
                  }}
                >
                  {store.name}
                </div>
              </CustomOverlayMap>
            </React.Fragment>
          );
        })}
      </KakaoMap>
    </div>
  );
};

export default StoreMap;

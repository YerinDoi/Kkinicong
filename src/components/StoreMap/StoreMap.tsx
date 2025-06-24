import KakaoMap, {
  MARKER,
  MARKER_IMAGE_SIZE,
  DOT_MARKER,
  DOT_IMAGE_SIZE,
} from '@/components/common/KakaoMap';
import { Store } from '@/types/store';
import React, { useEffect, useState } from 'react';
import { MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';

interface StoreMapProps {
  stores: Store[];
  latestBatchStores: Store[];
  center: { lat: number; lng: number }; // 지도 중심 좌표
  level: number; // 지도 확대 레벨
  onMapChange?: (
    center: { lat: number; lng: number },
    level: number,
    byUser?: boolean,
  ) => void; // 통합된 지도 변경 핸들러
  onMarkerClick?: (marker: { lat: number; lng: number; name: string }) => void; // 마커 클릭 핸들러 추가
  onMapClick?: () => void; // 지도 빈 곳 클릭 핸들러 추가
  onMapLoad?: (map: any) => void; // 지도 인스턴스 전달
}

// 두 지점 간의 거리를 계산하는 함수 (단위: degree)
function calculateDistance(
  pos1: { lat: number; lng: number },
  pos2: { lat: number; lng: number },
): number {
  const latDiff = Math.abs(pos1.lat - pos2.lat);
  const lngDiff = Math.abs(pos1.lng - pos2.lng);
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
}

// 도트 마커 이름 표시 여부 결정 함수
function shouldShowDotMarkerName(
  mapLevel: number,
  currentPosition: { lat: number; lng: number },
  allPositions: Array<{ lat: number; lng: number }>,
): boolean {
  if (mapLevel <= 2) return true; // level 1~2: 모두 표시

  // 줌 레벨에 따른 거리 임계값 설정
  let DISTANCE_THRESHOLD;
  if (mapLevel === 3) {
    DISTANCE_THRESHOLD = 0.0005; // 약 80-90m
  } else if (mapLevel === 4) {
    DISTANCE_THRESHOLD = 0.001; // 약 120-130m
  } else {
    return false; // level 5 이상: 표시 안 함
  }

  // 주변 마커와의 거리를 체크
  const nearbyMarkers = allPositions.filter(
    (pos) =>
      pos !== currentPosition &&
      calculateDistance(pos, currentPosition) < DISTANCE_THRESHOLD,
  );

  // 주변 마커가 2개 초과면 이름 표시하지 않음
  return nearbyMarkers.length <= 2;
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

  useEffect(() => {
    if (!mapInstance || !onMapChange) return;
    if (!(window as any).kakao || !(window as any).kakao.maps) return;

    // 드래그 종료(사용자 조작)
    const handleDragEnd = function () {
      const center = mapInstance.getCenter();
      onMapChange(
        { lat: center.getLat(), lng: center.getLng() },
        mapInstance.getLevel(),
        true, // 사용자 조작!
      );
    };
    // @ts-ignore
    window.kakao.maps.event.addListener(mapInstance, 'dragend', handleDragEnd);

    // 줌 변경(사용자 조작)
    const handleZoomChanged = function () {
      const center = mapInstance.getCenter();
      onMapChange(
        { lat: center.getLat(), lng: center.getLng() },
        mapInstance.getLevel(),
        true, // 사용자 조작!
      );
    };
    // @ts-ignore
    window.kakao.maps.event.addListener(
      mapInstance,
      'zoom_changed',
      handleZoomChanged,
    );

    // cleanup
    return () => {
      // @ts-ignore
      window.kakao.maps.event.removeListener(
        mapInstance,
        'dragend',
        handleDragEnd,
      );
      // @ts-ignore
      window.kakao.maps.event.removeListener(
        mapInstance,
        'zoom_changed',
        handleZoomChanged,
      );
    };
  }, [mapInstance, onMapChange]);

  return (
    <div
      className="w-full h-full"
      onClick={(e) => {
        // 마커 클릭 시에는 지도 클릭 이벤트가 실행되지 않도록 함
        if (e.defaultPrevented) return;
        if (onMapClick) onMapClick();
      }}
    >
      <KakaoMap
        center={center}
        level={level}
        onMapLoad={(map) => {
          setMapInstance(map);
          if (onMapLoad) onMapLoad(map);
        }}
      >
        {stores.map((store, idx) => {
          const isDot = !latestBatchStores.some(
            (latest) => latest.id === store.id,
          );
          const markerPosition = { lat: store.latitude, lng: store.longitude };

          if (isDot) {
            // 모든 도트 마커의 위치 정보 수집
            const dotMarkerPositions = stores
              .filter(
                (s) => !latestBatchStores.some((latest) => latest.id === s.id),
              )
              .map((s) => ({ lat: s.latitude, lng: s.longitude }));

            const showName = shouldShowDotMarkerName(
              level,
              markerPosition,
              dotMarkerPositions,
            );

            // 점 마커 (이름 없음)
            return (
              <React.Fragment key={`dot-marker-group-${store.id}`}>
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
                  onClick={() => {
                    if (onMarkerClick) {
                      onMarkerClick({
                        lat: store.latitude,
                        lng: store.longitude,
                        name: store.name,
                      });
                    }
                  }}
                  zIndex={50}
                />
                {showName && (
                  <CustomOverlayMap
                    key={`dot-overlay-${store.id}`}
                    position={markerPosition}
                    yAnchor={1.1}
                    xAnchor={0.5}
                    zIndex={51}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#222',
                        background: 'none',
                        padding: 0,
                        borderRadius: 0,
                        whiteSpace: 'nowrap',
                        pointerEvents: 'auto',
                        transform: 'translateY(130%)',
                        textAlign: 'center',
                        fontWeight: 500,
                        textShadow:
                          '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
                      }}
                      onClick={(e) => {
                        e.preventDefault(); // 상위 div의 onClick 방지
                        if (onMarkerClick) {
                          onMarkerClick({
                            lat: store.latitude,
                            lng: store.longitude,
                            name: store.name,
                          });
                        }
                      }}
                    >
                      {store.name}
                    </div>
                  </CustomOverlayMap>
                )}
              </React.Fragment>
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
                onClick={() => {
                  if (onMarkerClick) {
                    onMarkerClick({
                      lat: store.latitude,
                      lng: store.longitude,
                      name: store.name,
                    });
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
                    background: 'none',
                    padding: 0,
                    borderRadius: 0,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'auto',
                    transform: 'translateY(130%)',
                    textAlign: 'center',
                    textShadow:
                      '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
                  }}
                  onClick={(e) => {
                    e.preventDefault(); // 상위 div의 onClick 방지
                    if (onMarkerClick) {
                      onMarkerClick({
                        lat: store.latitude,
                        lng: store.longitude,
                        name: store.name,
                      });
                    }
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

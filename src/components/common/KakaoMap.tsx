import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import useKakaoMapLoader from '@/hooks/useKakaoMapLoader';
import { useEffect, useRef, useState } from 'react';

interface KakaoMapProps {
  center: { lat: number; lng: number }; // 지도 중심 좌표
  markers: { lat: number; lng: number; name: string }[]; // 마커 위치 및 이름 배열
  level: number; // 지도 확대 레벨 (선택 아님)
  onMapChange?: (center: { lat: number; lng: number }, level: number) => void; // 통합된 지도 변경 핸들러
  onMarkerClick?: (marker: { lat: number; lng: number; name: string }) => void; // 마커 클릭 핸들러 추가
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  center,
  markers,
  level,
  onMapChange, // prop 변경
  onMarkerClick,
}) => {
  const { kakao, loading, error } = useKakaoMapLoader();
  const mapRef = useRef<kakao.maps.Map | null>(null);

  // 지도 중심 또는 줌 레벨 변경 시 호출되는 핸들러
  const handleMapChange = () => {
    if (mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      const currentLevel = mapRef.current.getLevel();
      if (onMapChange) {
        onMapChange(
          { lat: currentCenter.getLat(), lng: currentCenter.getLng() },
          currentLevel,
        );
      }
    }
  };

  // 지도가 생성되었을 때 초기 줌 레벨 설정 및 영역 변경 감지 시작
  useEffect(() => {
    if (mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      const currentLevel = mapRef.current.getLevel();
      if (onMapChange) {
        onMapChange(
          { lat: currentCenter.getLat(), lng: currentCenter.getLng() },
          currentLevel,
        );
      }
    }
  }, [mapRef.current, onMapChange]); // mapRef, onMapChange 변경 시 useEffect 실행

  if (loading) {
    return <div>지도를 불러오는 중입니다.</div>;
  }

  if (error) {
    return <div>지도를 불러오는 중에 오류가 발생했습니다.</div>;
  }

  if (kakao) {
    return (
      <Map
        center={center}
        level={level}
        style={{ width: '100%', height: '100%' }}
        onCenterChanged={handleMapChange} // 중심 변경 시 핸들러 호출
        onZoomChanged={handleMapChange} // 줌 변경 시 핸들러 호출
        onClick={(_map, mouseEvent) => {
          // console.log(
          //   '지도 클릭 감지됨:',
          //   mouseEvent.latLng.getLat(),
          //   mouseEvent.latLng.getLng(),
          // );
        }} // 지도 클릭 이벤트 핸들러 추가
        onCreate={(map: kakao.maps.Map) => {
          mapRef.current = map;
        }}
      >
        {markers.map((marker, index) => (
          <MapMarker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            // onClick prop 대신 onCreate를 통해 원본 마커에 이벤트 리스너 직접 연결
            onCreate={(markerInstance) => {
              if (kakao) {
                kakao.maps.event.addListener(markerInstance, 'click', () => {
                  onMarkerClick && onMarkerClick(marker);
                });
              }
            }}
            zIndex={100} // 마커의 z-index를 높게 설정
          />
        ))}
        {/* 마커 이름 오버레이 복원 및 z-index 조정 */}
        {level <= 4 &&
          markers.map((marker, index) => (
            <CustomOverlayMap
              key={`custom-overlay-${index}`}
              position={{ lat: marker.lat, lng: marker.lng }}
              yAnchor={-0.2}
              xAnchor={0.5}
              zIndex={1} // 마커(zIndex: 100)보다 낮은 z-index 설정
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  pointerEvents: 'none', // 클릭 이벤트를 통과시키도록 설정
                }}
              >
                {marker.name}
              </div>
            </CustomOverlayMap>
          ))}
      </Map>
    );
  }

  return null;
};

export default KakaoMap;

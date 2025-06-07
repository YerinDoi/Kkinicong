import { Map, MapMarker } from 'react-kakao-maps-sdk';
import useKakaoMapLoader from '@/hooks/useKakaoMapLoader';
import { useEffect, useRef, useState } from 'react';

interface KakaoMapProps {
  center: { lat: number; lng: number }; // 지도 중심 좌표
  markers: { lat: number; lng: number }[]; // 마커 위치 배열
  level?: number; // 지도 확대 레벨 (선택적)
  onBoundsChange?: (bounds: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  }) => void;
  onZoomChange?: (level: number) => void; // 줌 레벨 변경 핸들러 추가
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  center,
  markers,
  level = 3,
  onBoundsChange,
  onZoomChange, // prop 추가
}) => {
  const { kakao, loading, error } = useKakaoMapLoader();
  const mapRef = useRef<kakao.maps.Map | null>(null);

  // 지도 중심 또는 줌 레벨 변경 시 호출되는 핸들러
  const handleMapChange = () => {
    if (mapRef.current) {
      // 영역 변경 이벤트 핸들러 호출
      if (onBoundsChange) {
        const bounds = mapRef.current.getBounds();
        const swLatLng = bounds.getSouthWest();
        const neLatLng = bounds.getNorthEast();
        onBoundsChange({
          sw: { lat: swLatLng.getLat(), lng: swLatLng.getLng() },
          ne: { lat: neLatLng.getLat(), lng: neLatLng.getLng() },
        });
      }
      // 줌 레벨 변경 이벤트 핸들러 호출
      if (onZoomChange) {
        onZoomChange(mapRef.current.getLevel());
      }
    }
  };

  // 지도가 생성되었을 때 초기 줌 레벨 설정 및 영역 변경 감지 시작
  useEffect(() => {
    if (mapRef.current) {
      // 지도가 로드된 후 초기 줌 레벨 설정
      if (onZoomChange) {
        onZoomChange(mapRef.current.getLevel());
      }
      // 초기 지도 영역 정보 전달
      if (onBoundsChange) {
        const bounds = mapRef.current.getBounds();
        const swLatLng = bounds.getSouthWest();
        const neLatLng = bounds.getNorthEast();
        onBoundsChange({
          sw: { lat: swLatLng.getLat(), lng: swLatLng.getLng() },
          ne: { lat: neLatLng.getLat(), lng: neLatLng.getLng() },
        });
      }
    }
  }, [mapRef.current, onBoundsChange, onZoomChange]); // mapRef, onBoundsChange, onZoomChange 변경 시 useEffect 실행

  if (loading) {
    return <div>지도를 불러오는 중입니다.</div>;
  }

  if (error) {
    return <div>지도를 불러오는 중에 오류가 발생했습니다.</div>;
  }

  if (kakao) {
    console.log('마커 데이터:', markers); // 디버깅용 로그 추가
    return (
      <Map
        center={center}
        level={level}
        style={{ width: '100%', height: '100%', minHeight: '224px' }}
        onCenterChanged={handleMapChange} // 중심 변경 시 핸들러 호출
        onZoomChanged={handleMapChange} // 줌 변경 시 핸들러 호출
        onCreate={(map: kakao.maps.Map) => {
          mapRef.current = map;
        }}
      >
        {markers.map((marker, index) => (
          <MapMarker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
          />
        ))}
      </Map>
    );
  }

  return null;
};

export default KakaoMap;

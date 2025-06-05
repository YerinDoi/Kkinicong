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
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  center,
  markers,
  level = 3,
  onBoundsChange,
}) => {
  const { kakao, loading, error } = useKakaoMapLoader();
  const mapRef = useRef<kakao.maps.Map | null>(null);

  const handleBoundsChange = () => {
    if (mapRef.current && onBoundsChange) {
      const bounds = mapRef.current.getBounds();
      const swLatLng = bounds.getSouthWest();
      const neLatLng = bounds.getNorthEast();

      onBoundsChange({
        sw: { lat: swLatLng.getLat(), lng: swLatLng.getLng() },
        ne: { lat: neLatLng.getLat(), lng: neLatLng.getLng() },
      });
    }
  };

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
        onCenterChanged={handleBoundsChange}
        onZoomChanged={handleBoundsChange}
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

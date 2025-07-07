import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import useKakaoMapLoader from '@/hooks/useKakaoMapLoader';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { KakaoMapContext } from '@/contexts/KakaoMapContext';

interface KakaoMapProps {
  center: { lat: number; lng: number }; // 지도 중심 좌표
  level: number; // 지도 확대 레벨 (선택 아님)
  onMapLoad?: (map: kakao.maps.Map) => void; // 지도 인스턴스 로드 시 콜백 추가
  children?: React.ReactNode; // 마커 및 오버레이를 자식으로 받음
  relayoutTrigger?: any;
}

// 마커 이미지 소스 (KakaoMap 외부에 정의하여 재사용성 높임)
export const MARKER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="41" viewBox="0 0 28 41"><path fill="%2365CE58" d="M14 0c7.732 0 14 6.268 14 14 0 10.5-14 27-14 27S0 24.5 0 14C0 6.268 6.268 0 14 0z"/><circle fill="%23FFFFFF" cx="14" cy="14" r="6"/></svg>';
export const MARKER_IMAGE_SIZE = { width: 28, height: 41 };

export const DOT_MARKER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><circle fill="%2365CE58" cx="6" cy="6" r="6"/></svg>';
export const DOT_IMAGE_SIZE = { width: 12, height: 12 };

const KakaoMap: React.FC<KakaoMapProps> = ({
  center,
  level,
  onMapLoad,
  children, // children prop 받음
  relayoutTrigger,
}) => {
  const { kakao, loading, error } = useKakaoMapLoader();
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false); // mapLoaded 상태 추가

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.relayout();
    }
  }, [relayoutTrigger]);

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
        onClick={(_map, mouseEvent) => {}}
        onCreate={(map: kakao.maps.Map) => {
          mapRef.current = map;
          setMapLoaded(true); // 지도가 로드되면 mapLoaded 상태를 true로 설정
          if (onMapLoad) {
            onMapLoad(map);
          }
        }}
      >
        {/* 자식 컴포넌트들을 여기에 렌더링 */}
        {mapLoaded && ( // 지도가 로드된 후에만 Context Provider와 자식들 렌더링
          <KakaoMapContext.Provider value={{ kakao }}>
            {children}
          </KakaoMapContext.Provider>
        )}
      </Map>
    );
  }

  return null;
};

export default KakaoMap;

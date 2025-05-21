import { Map, MapMarker } from 'react-kakao-maps-sdk';
import useKakaoMapLoader from '@/hooks/useKakaoMapLoader';
import { useEffect, useRef, useState } from 'react';

interface KakaoMapProps {
    center: { lat: number; lng: number };  // 지도 중심 좌표
    markers: { lat: number; lng: number }[];  // 마커 위치 배열
    level?: number;  // 지도 확대 레벨 (선택적)  
}

const KakaoMap: React.FC<KakaoMapProps> = ({ center, markers, level = 3 }) => {
    const { kakao, loading, error } = useKakaoMapLoader();

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
                style={{ width: '100%', height: '224px'}}
            >
                {markers.map((marker, index) => (
                    <MapMarker key={index} position={marker} />
                ))}
            </Map>
        );
    }

    return null;
};

export default KakaoMap;
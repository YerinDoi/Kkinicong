import KakaoMap, {
  MARKER,
  MARKER_IMAGE_SIZE,
} from '@/components/common/KakaoMap';
import { MapMarker, CustomOverlayMap, useMap } from 'react-kakao-maps-sdk';
import { useEffect } from 'react';
import React from 'react';

interface ScrapMapSectionProps {
  scrapStores: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    // 기타 필요한 필드
  }[];
  height: number;
  onMarkerClick: (store: any) => void;
  onMapClick: () => void;
}

const FitBounds = ({
  scrapStores,
}: {
  scrapStores: ScrapMapSectionProps['scrapStores'];
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || scrapStores.length === 0) return;
    const bounds = new window.kakao.maps.LatLngBounds();
    scrapStores.forEach((store) => {
      bounds.extend(
        new window.kakao.maps.LatLng(store.latitude, store.longitude),
      );
    });
    map.setBounds(bounds);
  }, [map, scrapStores]);

  return null;
};

const MapClickListener = ({ onMapClick }: { onMapClick: () => void }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    window.kakao.maps.event.addListener(map, 'click', onMapClick);
    return () => {
      window.kakao.maps.event.removeListener(map, 'click', onMapClick);
    };
  }, [map, onMapClick]);
  return null;
};

const ScrapMapSection = ({
  scrapStores,
  height,
  onMarkerClick,
  onMapClick,
}: ScrapMapSectionProps) => {
  return (
    <div
      className="w-full"
      style={{ height: `${height}px`, transition: 'height 0.3s ease-out' }}
    >
      <KakaoMap
        center={{ lat: 37.494589, lng: 126.868346 }}
        level={3}
        relayoutTrigger={height}
      >
        <MapClickListener onMapClick={onMapClick} />
        <FitBounds scrapStores={scrapStores} />
        {scrapStores.map((store) => (
          <React.Fragment key={store.id}>
            <MapMarker
              key={`marker-${store.id}`}
              position={{ lat: store.latitude, lng: store.longitude }}
              title={store.name}
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
              zIndex={100}
              onClick={() => onMarkerClick(store)}
            />
            <CustomOverlayMap
              key={`pin-overlay-${store.id}`}
              position={{ lat: store.latitude, lng: store.longitude }}
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
                  cursor: 'pointer',
                  transform: 'translateY(130%)',
                  textAlign: 'center',
                  textShadow:
                    '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkerClick(store);
                }}
              >
                {store.name}
              </div>
            </CustomOverlayMap>
          </React.Fragment>
        ))}
      </KakaoMap>
    </div>
  );
};

export default ScrapMapSection;

import { useState } from 'react';

const DEFAULT_LOCATION = {
  latitude: 37.495472,
  longitude: 126.676902,
};

export interface UserLocation {
  latitude: number;
  longitude: number;
}

interface UseUserLocationResult {
  isGpsActive: boolean;
  address: string;
  location: UserLocation;
  requestGps: (onLocated?: (lat: number, lng: number) => void) => void;
  error: string | null;
  isLoading: boolean;
}

const useUserLocation = (): UseUserLocationResult => {
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 카카오 reverse geocoding
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
          },
        },
      );
      const data = await response.json();
      if (data.documents && data.documents.length > 0) {
        return data.documents[0].address.address_name;
      }
      return '';
    } catch (e) {
      return '';
    }
  };

  const requestGps = (onLocated?: (lat: number, lng: number) => void) => {
    setIsLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('이 브라우저에서는 위치 정보가 지원되지 않습니다.');
      setIsLoading(false);
      setIsGpsActive(false);
      setLocation(DEFAULT_LOCATION);
      setAddress('');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        setIsGpsActive(true);
        const addr = await fetchAddress(latitude, longitude);
        setAddress(addr);
        setIsLoading(false);
        if (onLocated) onLocated(latitude, longitude);
      },
      (err) => {
        setError('위치 권한이 거부되었습니다.');
        setIsGpsActive(false);
        setLocation(DEFAULT_LOCATION);
        setAddress('');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return {
    isGpsActive,
    address,
    location,
    requestGps,
    error,
    isLoading,
  };
};

export default useUserLocation;

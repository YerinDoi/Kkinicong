import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const DEFAULT_LOCATION = { latitude: 37.495472, longitude: 126.676902 };

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface GpsContextType {
  isGpsActive: boolean;
  address: string;
  location: UserLocation;
  requestGps: (onLocated?: (lat: number, lng: number) => void) => void;
  error: string | null;
  isLoading: boolean;
}

const GpsContext = createContext<GpsContextType | null>(null);

interface GpsProviderProps {
  children: ReactNode;
}

export function GpsProvider({ children }: GpsProviderProps) {
  // 회원/비회원 여부 Redux에서 받아오기
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const [isGpsActive, setIsGpsActive] = useState(false);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // 수동(즐겨찾기) 위치 설정
  const setManualLocation = (lat: number, lng: number) => {
    setLocation({ latitude: lat, longitude: lng });
    setIsGpsActive(false); // GPS 기반이 아님을 명시
  };

  // 카카오 reverse geocoding
  const fetchAddress = async (lat: number, lng: number): Promise<string> => {
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
      // 비회원: 디폴트, 회원: 자주 가는 지역 → 없으면 디폴트
      if (isLoggedIn) {
        // TODO: 자주 가는 지역 구현 후 아래와 같은 코드로 대체
        // if (favoriteRegion) {
        //   setLocation(favoriteRegion);
        //   setAddress('자주 가는 지역 주소');
        //   return;
        // }
      }
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
        // 비회원: 디폴트, 회원: 자주 가는 지역 → 없으면 디폴트
        if (isLoggedIn) {
          // TODO: 자주 가는 지역 구현 후 아래와 같은 코드로 대체
          // if (favoriteRegion) {
          //   setLocation(favoriteRegion);
          //   setAddress('자주 가는 지역 주소');
          //   return;
          // }
        }
        setLocation(DEFAULT_LOCATION);
        setAddress('');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <GpsContext.Provider
      value={{
        isGpsActive,
        address,
        location,
        requestGps,
        error,
        isLoading,
      }}
    >
      {children}
    </GpsContext.Provider>
  );
}

export function useGps() {
  const context = useContext(GpsContext);
  if (!context)
    throw new Error('useGps는 GpsProvider 내부에서만 사용해야 합니다.');
  return context;
}

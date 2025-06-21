import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import axiosInstance from '@/api/axiosInstance';

const DEFAULT_LOCATION = { latitude: 37.495472, longitude: 126.676902 }; // 인천 서구청

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface GpsContextType {
  isGpsActive: boolean;
  address: string;
  location: UserLocation;
  requestGps: (onLocated?: (lat: number, lng: number) => void) => Promise<void>;
  fetchStoresWithLocation: (
    apiPath: string,
    setData: (stores: any[]) => void,
    useFallback?: boolean,
  ) => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

const GpsContext = createContext<GpsContextType | null>(null);

interface GpsProviderProps {
  children: ReactNode;
}

export function GpsProvider({ children }: GpsProviderProps) {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const [isGpsActive, setIsGpsActive] = useState(false);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    } catch {
      return '';
    }
  };

  const getLocationFromManualStorage =
    async (): Promise<UserLocation | null> => {
      const stored = localStorage.getItem('manualLocation');
      if (!stored) return null;

      const { city, district } = JSON.parse(stored);
      try {
        const res = await axiosInstance.get('/api/v1/user/place');
        const match = res.data.results.find(
          (item: { city: string; district: string }) =>
            item.city === city && item.district === district,
        );
        if (match)
          return { latitude: match.latitude, longitude: match.longitude };
      } catch (e) {
        console.error('즐겨찾는 지역 로딩 실패', e);
      }
      return null;
    };

  const fallbackToDefaultOrFavorite = async () => {
    const manualLoc = await getLocationFromManualStorage();
    if (manualLoc) {
      setLocation(manualLoc);
      setAddress('자주 가는 지역');
      return;
    }

    if (isLoggedIn) {
      try {
        const res = await axiosInstance.get('/api/v1/user/place');
        if (res.data?.latitude && res.data?.longitude) {
          setLocation({
            latitude: res.data.latitude,
            longitude: res.data.longitude,
          });
          setAddress(res.data.address || '자주 가는 지역');
          return;
        }
      } catch (e) {
        console.error('자주 가는 지역 불러오기 실패', e);
      }
    }

    setLocation(DEFAULT_LOCATION);
    setAddress('');
  };

  const requestGps = async (
    onLocated?: (lat: number, lng: number) => void,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('이 브라우저에서는 위치 정보가 지원되지 않습니다.');
      setIsGpsActive(false);
      await fallbackToDefaultOrFavorite();
      setIsLoading(false);
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
      async (err) => {
        console.error('Geolocation error:', err);
        setError('위치 권한이 거부되었습니다.');
        setIsGpsActive(false);
        await fallbackToDefaultOrFavorite();
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const fetchStoresWithLocation = useCallback(
    async (
      apiPath: string,
      setData: (stores: any[]) => void,
      useFallback = false,
    ) => {
      const fallbackLoc = await getLocationFromManualStorage();
      const currentLoc =
        (isGpsActive && location) || fallbackLoc || DEFAULT_LOCATION;

      try {
        const res = await axiosInstance.get(apiPath, {
          params: currentLoc,
        });

        if (useFallback && res.data?.results?.length === 0) {
          const fallbackRes = await axiosInstance.get(apiPath, {
            params: DEFAULT_LOCATION,
          });
          setData(fallbackRes.data?.results ?? []);
        } else {
          setData(res.data?.results ?? []);
        }
      } catch (err) {
        console.error('가맹점 불러오기 실패', err);
        setData([]);
      }
    },
    [isGpsActive, location],
  );

  return (
    <GpsContext.Provider
      value={{
        isGpsActive,
        address,
        location,
        requestGps,
        fetchStoresWithLocation,
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

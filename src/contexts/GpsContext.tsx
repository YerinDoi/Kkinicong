import React, {
  createContext,
  useContext,
  useEffect,
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

  const getFavoriteLocationFromServer =
    async (): Promise<UserLocation | null> => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn(
          '[getFavoriteLocationFromServer] 토큰 없음, API 요청 생략',
        );
        return null;
      }
      try {
        const res = await axiosInstance.get('/api/v1/user/place', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('[getFavoriteLocationFromServer] 응답:', res.data);

        if (
          res.data?.isSuccess &&
          res.data?.results?.latitude &&
          res.data?.results?.longitude
        ) {
          return {
            latitude: res.data.results.latitude,
            longitude: res.data.results.longitude,
          };
        } else {
          console.log('[getFavoriteLocationFromServer] 좌표 정보 없음');
        }
      } catch (e) {
        console.error('즐겨찾는 지역 로딩 실패', e);
      }
      return null;
    };

  const fallbackToDefaultOrFavorite = async () => {
    console.log('[fallbackToDefaultOrFavorite] 시작');
    const favorite = await getFavoriteLocationFromServer();

    if (favorite) {
      console.log(
        '[fallbackToDefaultOrFavorite] 즐겨찾기 위치 사용:',
        favorite,
      );
      setLocation(favorite);
      const addr = await fetchAddress(favorite.latitude, favorite.longitude);
      setAddress(addr);
      return;
    }

    console.log('[fallbackToDefaultOrFavorite] 즐겨찾기 없음 → 기본 위치 사용');
    setLocation(DEFAULT_LOCATION);
    setAddress('');
  };

  //실제로 GPS 요청 시도
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
    //성공하면 위경도 저장
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
        await fallbackToDefaultOrFavorite(); //실패하면 fallback
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // 현재 위치 기준으로 가맹점 데이터 불러오는 함수
  const fetchStoresWithLocation = useCallback(
    async (
      apiPath: string,
      setData: (stores: any[]) => void,
      useFallback = false,
    ) => {
      const fallbackLoc = await getFavoriteLocationFromServer();
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

  //사용자가 gps요청 안해도 기본 위치 세팅
  useEffect(() => {
    fallbackToDefaultOrFavorite();
  }, []);

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

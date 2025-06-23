import { useState, useCallback } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface SearchAddressResult {
  isLocation: boolean;
  coordinates: Coordinates | null;
}

// API 요청 시 사용할 파라미터 타입 정의
interface FetchParams {
  latitude: number;
  longitude: number;
  keyword?: string;
  radius?: number;
  [key: string]: any;
}

interface HandleSearchResult {
  newMapCenter: { lat: number; lng: number };
}

const useStoreSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocation, setIsLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null); // 초기값을 null로 설정

  // 검색어 처리 로직을 별도 함수로 분리
  const processSearchParams = useCallback(
    (params: FetchParams, searchTerm: string) => {
      // 동/구/역으로 끝나는 검색어일 때는 keyword 제외
      if (/동$|구$|역$/.test(searchTerm)) {
        const { keyword, ...restParams } = params;
        return restParams;
      }
      // 그 외에는 keyword 포함
      return params;
    },
    [],
  );

  // 카카오 API를 사용하여 주소 검색 및 위경도 변환
  const searchAddress = useCallback(
    async (keyword: string): Promise<SearchAddressResult> => {
      try {
        // 동/구/역으로 끝나는지 확인 (주소 형식 판단)
        const isAddress = /동$|구$|역$/.test(keyword);

        if (!isAddress) {
          console.log('useStoreSearch: 일반 키워드 검색으로 처리:', keyword);
          setIsLocation(false);
          setCoordinates(null);
          return { isLocation: false, coordinates: null };
        }

        console.log('useStoreSearch: 지역명 검색 시작:', keyword);
        const response = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}`,
          {
            headers: {
              Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
            },
          },
        );
        const data = await response.json();
        console.log('useStoreSearch: 카카오 API 응답:', data);

        if (data.documents && data.documents.length > 0) {
          const { y: latitude, x: longitude } = data.documents[0];
          console.log('useStoreSearch: 지역 위경도 변환 결과:', {
            latitude,
            longitude,
          });
          const newCoordinates = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          };
          setCoordinates(newCoordinates);
          setIsLocation(true);
          return { isLocation: true, coordinates: newCoordinates };
        }
        setIsLocation(false);
        setCoordinates(null);
        return { isLocation: false, coordinates: null };
      } catch (error) {
        console.error('useStoreSearch: 주소 검색 중 오류 발생:', error);
        setIsLocation(false);
        setCoordinates(null);
        return { isLocation: false, coordinates: null };
      }
    },
    [],
  );

  const handleSearch = useCallback(
    async (
      searchInput: string,
      gpsLocation: { latitude: number; longitude: number },
      isGpsActive: boolean,
    ): Promise<HandleSearchResult> => {
      setInputValue(searchInput);
      setSearchTerm(searchInput);
      const { isLocation: isLoc, coordinates: coords } =
        await searchAddress(searchInput);
      setIsLocation(isLoc);

      if (isLoc && coords) {
        return {
          newMapCenter: { lat: coords.latitude, lng: coords.longitude },
        };
      }

      // 일반 키워드 검색 시, 하드코딩된 위치 대신 페이지 컴포넌트로부터 전달받은 위치를 그대로 사용
      // - 지도 페이지에서는 '지도 중심'이 전달
      // - 찾기 페이지에서는 'GPS/즐겨찾기/기본값' 위치가 전달
      return {
        newMapCenter: { lat: gpsLocation.latitude, lng: gpsLocation.longitude },
      };
    },
    [searchAddress, setInputValue, setSearchTerm, setIsLocation],
  );

  return {
    inputValue,
    setInputValue,
    searchTerm,
    setSearchTerm, // 필요에 따라 외부에서 searchTerm을 직접 설정할 수 있도록 노출
    isLocation,
    coordinates,
    handleSearch,
    searchAddress, // 필요에 따라 searchAddress 함수 자체를 노출
    processSearchParams, // 외부에서도 사용할 수 있도록 export
  };
};

export default useStoreSearch;

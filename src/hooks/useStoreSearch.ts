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
  [key: string]: any;
}

const useStoreSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocation, setIsLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null); // 초기값을 null로 설정

  // 검색어 처리 로직을 별도 함수로 분리
  const processSearchParams = useCallback(
    (params: FetchParams, searchTerm: string) => {
      // 동/구/역으로 끝나는 검색어이고 위경도가 있을 때는 keyword 제외
      if (
        /동$|구$|역$/.test(searchTerm) &&
        params.latitude &&
        params.longitude
      ) {
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
      fetchStores: (params: FetchParams) => void,
      gpsLocation: { latitude: number; longitude: number },
      isGpsActive: boolean,
      setMapCenter: (center: { lat: number; lng: number }) => void,
    ) => {
      setInputValue(searchInput);

      // 동/구/역으로 끝나면 위경도 변환
      const { isLocation, coordinates } = await searchAddress(searchInput);

      // searchTerm 업데이트를 fetchStores 호출 직전에 수행
      setSearchTerm(searchInput);

      if (isLocation && coordinates) {
        // 지도 중심 이동
        setMapCenter({
          lat: coordinates.latitude,
          lng: coordinates.longitude,
        });

        const params = processSearchParams(
          {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            keyword: searchInput,
          },
          searchInput,
        );

        fetchStores(params);
        return;
      }

      // 그 외: GPS(없으면 디폴트) + 키워드
      const gps = isGpsActive
        ? gpsLocation
        : { latitude: 37.495472, longitude: 126.676902 };

      // GPS 위치로 지도 중심 이동
      setMapCenter({
        lat: gps.latitude,
        lng: gps.longitude,
      });

      const params = processSearchParams(
        {
          latitude: gps.latitude,
          longitude: gps.longitude,
          keyword: searchInput,
        },
        searchInput,
      );

      fetchStores(params);
    },
    [searchAddress, processSearchParams],
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

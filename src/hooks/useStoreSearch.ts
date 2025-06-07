import { useState, useCallback } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface SearchAddressResult {
  isLocation: boolean;
  coordinates: Coordinates | null;
}

const useStoreSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocation, setIsLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null); // 초기값을 null로 설정

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
    async (searchInput: string) => {
      console.log('useStoreSearch: handleSearch: 검색 시작', searchInput);

      // 위경도 변환 시도
      const { isLocation: newIsLocation, coordinates: newCoordinates } =
        await searchAddress(searchInput);

      // 검색어 상태 업데이트
      setSearchTerm(searchInput);

      // 주소 검색 결과 상태 업데이트 (searchAddress 내부에서 이미 처리되지만, 콜백 반환값도 사용 가능)
      setIsLocation(newIsLocation);
      setCoordinates(newCoordinates);

      // StoreSearchPage나 StoreMapPage에서 이 결과를 사용하여 다음 작업을 수행
      console.log('useStoreSearch: handleSearch 완료', {
        newIsLocation,
        newCoordinates,
        searchInput,
      });
    },
    [searchAddress],
  ); // searchAddress가 useCallback 내부에서 사용되므로 의존성에 포함

  return {
    inputValue,
    setInputValue,
    searchTerm,
    setSearchTerm, // 필요에 따라 외부에서 searchTerm을 직접 설정할 수 있도록 노출
    isLocation,
    coordinates,
    handleSearch,
    searchAddress, // 필요에 따라 searchAddress 함수 자체를 노출
  };
};

export default useStoreSearch;

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Store } from '@/types/store';
import axiosInstance from '@/api/axiosInstance';
import { useRef, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import SearchInput from '@/components/common/SearchInput';
import MenuCategoryCarousel from '@/components/StoreSearch/MenuCategoryCarousel';
import StoreList from '@/components/StoreSearch/StoreList';
import NoSearchResults from '@/components/common/NoSearchResults';
import Icons from '@/assets/icons';
import StoreMap from '@/components/StoreMap/StoreMap';

const categoryMapping: { [key: string]: string } = {
  한식: 'KOREAN',
  양식: 'WESTERN',
  일식: 'JAPANESE',
  중식: 'CHINESE',
  치킨: 'CHICKEN',
  분식: 'BUNSIK',
  샤브샤브: 'SHABU',
  아시안: 'ASIAN',
  도시락: 'LUNCHBOX',
  간식: 'DESSERT',
  기타: 'ETC',
};

const StoreMapPage = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(
    () => location.state?.selectedCategory || '전체',
  );
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocation, setIsLocation] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  const pageRef = useRef(0);
  const hasNextPageRef = useRef(true);
  const isLoadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 지도 상태 관리
  const [mapCenter, setMapCenter] = useState({
    lat: 37.495472,
    lng: 126.676902,
  }); // 기본값: 인천 서구청 좌표
  const [mapLevel, setMapLevel] = useState(3); // 기본 줌 레벨

  // 줌 레벨에 따른 반경 계산 함수 (예시: 필요에 따라 조정)
  const calculateRadius = (level: number): number => {
    // 줌 레벨이 낮을수록 (숫자가 클수록) 반경을 넓게 설정
    // 이 값들은 예시이며, 실제 지도 테스트를 통해 적절한 값을 찾아야 합니다.
    // Kakao Maps API v3의 줌 레벨 기준 대략적인 거리 (미터)

    if (level >= 4) return 500; // 동/읍/면 단위
    if (level >= 3) return 1000; // 시/군/구 단위
    if (level >= 2) return 3000; // 광역시/도 단위
    return 10000; // 전국 단위
  };

  // 카카오 API를 사용하여 주소 검색 및 위경도 변환
  const searchAddress = async (keyword: string) => {
    try {
      // 동/구/역으로 끝나는지 확인
      const isAddress = /동$|구$|역$/.test(keyword);

      if (!isAddress) {
        console.log('일반 키워드 검색으로 처리:', keyword);
        setIsLocation(false);
        return { isLocation: false, coordinates: null };
      }

      console.log('지역명 검색 시작:', keyword);
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}`,
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
          },
        },
      );
      const data = await response.json();
      console.log('카카오 API 응답:', data);

      if (data.documents && data.documents.length > 0) {
        const { y: latitude, x: longitude } = data.documents[0];
        console.log('지역 위경도 변환 결과:', { latitude, longitude });
        const newCoordinates = {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        };
        setCoordinates(newCoordinates);
        setIsLocation(true);
        return { isLocation: true, coordinates: newCoordinates };
      }
      setIsLocation(false);
      return { isLocation: false, coordinates: null };
    } catch (error) {
      console.error('주소 검색 중 오류 발생:', error);
      setIsLocation(false);
      return { isLocation: false, coordinates: null };
    }
  };

  const handleSearch = async (searchInput: string) => {
    console.log('검색 시작:', searchInput);

    // 위경도 변환 시도
    const { isLocation, coordinates: locationCoordinates } =
      await searchAddress(searchInput);

    // 검색어 상태 업데이트
    setSearchTerm(searchInput);

    // 위경도 변환이 완료된 후 해당 위치로 지도 중심 이동 (useEffect에서 데이터 로드)
    if (isLocation && locationCoordinates) {
      setMapCenter({
        lat: locationCoordinates.latitude,
        lng: locationCoordinates.longitude,
      });
      // 지도 중심 변경 시 useEffect가 트리거되어 가맹점 로드
    } else {
      // 일반 키워드 검색 (현재 지도 영역 유지하면서 키워드 검색)
      // searchTerm 상태 변경 시 useEffect가 트리거되어 가맹점 로드
    }
  };

  // API 호출 함수
  const fetchStores = useCallback(
    async (params: Record<string, any>) => {
      if (isLoadingRef.current) return; // 중복 호출 방지

      isLoadingRef.current = true;
      setIsLoading(true);
      try {
        console.log('API 요청 파라미터:', params);

        const response = await axiosInstance.get('/api/v1/store/map', {
          params,
        });

        console.log('API 응답:', response.data);
        console.log('API 응답 results:', response.data.results); // results 객체 상세 로그

        const results = response.data.results; // results 객체를 변수에 할당
        // results와 content 속성 존재 확인 후 할당, 없으면 빈 배열
        const newStores =
          results && Array.isArray(results.content) ? results.content : [];
        // 페이징 정보 없을 경우 마지막 페이지로 간주
        const isLastPage =
          results &&
          results.totalPage !== undefined &&
          results.currentPage !== undefined
            ? results.totalPage <= results.currentPage + 1
            : true;

        // 페이지가 0이면 새로운 목록으로 대체, 아니면 추가
        setStores((prev) =>
          params.page === 0 ? newStores : [...prev, ...newStores],
        );

        hasNextPageRef.current = !isLastPage;
        if (params.page === 0) {
          // 새로운 검색/지도 이동 시 페이지 1부터 시작
          pageRef.current = 1;
        } else if (!isLastPage) {
          // 무한 스크롤 성공 시 페이지만 증가
          pageRef.current += 1;
        }
      } catch (error) {
        console.error('가게 목록을 불러오는데 실패했습니다:', error);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [], // fetchStores 자체는 상태에 의존하지 않도록 빈 배열 유지
  );

  // 검색, 카테고리, 지도 상태 변경 시 데이터 로드
  useEffect(() => {
    console.log('useEffect: 검색 조건, 카테고리 또는 지도 상태 변경 감지');
    // 새로운 검색 조건 또는 지도 영역에서는 페이지 0부터 시작
    const page = 0;
    const size = 10; // 한 페이지에 가져올 가게 수
    const radius = calculateRadius(mapLevel);

    const params: Record<string, any> = {
      page: page,
      size: size,
      latitude: mapCenter.lat,
      longitude: mapCenter.lng,
      radius: radius,
    };

    if (selectedCategory !== '전체') {
      params.category = categoryMapping[selectedCategory];
    }

    if (searchTerm) {
      params.keyword = searchTerm;
    }

    fetchStores(params);
  }, [selectedCategory, searchTerm, mapCenter, mapLevel]); // 지도 상태를 의존성 배열에 추가

  // 지도 영역 및 줌 레벨 변경 시 상태 업데이트 핸들러
  // 이 핸들러는 StoreMap 컴포넌트의 onBoundsChange 및 onZoomChange 이벤트와 연결됩니다.
  const handleMapChange = useCallback(
    (center: { lat: number; lng: number }, level: number) => {
      console.log(
        'handleMapChange: 지도 중심 및 줌 레벨 변경 감지:',
        center,
        level,
      );
      // 지도의 중심 좌표와 줌 레벨 상태 업데이트. useEffect가 이를 감지하여 fetchStores 호출
      setMapCenter(center);
      setMapLevel(level);
    },
    [],
  ); // 의존성 배열 없음

  // stores 데이터가 업데이트될 때마다 지도의 중심을 업데이트 (처음 로딩 시만 사용)
  // 지도 조작에 따라 지도를 이동하는 것이 주 기능이므로 이 로직은 필요 없을 수 있습니다.
  // 현재는 지도 조작이 우선이므로 이 로직은 제거하겠습니다.
  // useEffect(() => {
  //   if (stores.length > 0) {
  //     const totalLat = stores.reduce((sum, store) => sum + store.latitude, 0);
  //     const totalLng = stores.reduce((sum, store) => sum + store.longitude, 0);

  //     setMapCenter({
  //       lat: totalLat / stores.length,
  //       lng: totalLng / stores.length,
  //     });
  //   }
  // }, [stores]);

  // 무한 스크롤 로직
  useEffect(() => {
    console.log('useEffect: 무한 스크롤 로직 감지');
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          !isLoadingRef.current &&
          hasNextPageRef.current
        ) {
          console.log('무한 스크롤 트리거, 다음 페이지 로드');
          // 무한 스크롤 시에는 현재 지도 상태와 검색 조건을 유지하며 다음 페이지 로드
          const radius = calculateRadius(mapLevel);
          const params: Record<string, any> = {
            page: pageRef.current,
            size: 10,
            latitude: mapCenter.lat,
            longitude: mapCenter.lng,
            radius: radius,
          };
          if (selectedCategory !== '전체') {
            params.category = categoryMapping[selectedCategory];
          }

          if (searchTerm) {
            params.keyword = searchTerm;
          }
          fetchStores(params);
        }
      },
      { threshold: 0.2, root: scrollContainerRef.current },
    );

    observer.observe(loaderRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    selectedCategory,
    searchTerm,
    mapCenter,
    mapLevel,
    fetchStores,
    hasNextPageRef,
  ]); // 의존성 배열 수정

  return (
    <div>
      <div className="flex flex-col items-center w-full mt-[11px]">
        <Header title="가맹점 지도" />

        <div className="flex gap-[12px] px-[20px] w-full">
          <button>
            <Icons name="gps" />
          </button>
          <SearchInput
            placeholder="가게이름을 검색하세요"
            value={inputValue}
            onChange={setInputValue}
            onSearch={() => handleSearch(inputValue)}
          />
        </div>
      </div>
      {/* 지도 영역 */}
      <div className="flex flex-col items-center w-full z-0">
        <StoreMap
          stores={stores}
          center={mapCenter} // 지도 중심 prop으로 전달
          level={mapLevel} // 지도 줌 레벨 prop으로 전달
          onBoundsChange={(bounds) =>
            handleMapChange(
              {
                lat: (bounds.sw.lat + bounds.ne.lat) / 2,
                lng: (bounds.sw.lng + bounds.ne.lng) / 2,
              },
              mapLevel,
            )
          } // 영역 변경 시 중심 좌표 계산하여 전달
          onZoomChange={(level) => handleMapChange(mapCenter, level)} // 줌 레벨 변경 시 현재 중심 좌표와 변경된 줌 레벨 전달
        />
      </div>
      {/* Drag Handle Container */}-{' '}
      <div>
        <div
          className="flex justify-center items-center"
          style={{
            width: '100%',
            height: '16px',
            flexShrink: 0,
            borderRadius: '12px 12px 0px 0px',
            background: '#FFF',
            boxShadow: '0px -13px 12px 0px rgba(0, 0, 0, 0.10)',
            zIndex: 100,
          }}
        >
          {/* 회색 핸들 표시 */}
          <div className="w-[85px] h-[4px] flex-shrink-0 rounded-md bg-[#D9D9D9]"></div>
        </div>
        {/* 카테고리 캐러셀 */}
        <div className="flex flex-col items-center w-full">
          <MenuCategoryCarousel
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
            }}
          />
        </div>
        {/* 캐러셀 아래 영역 전체 */}
        {/* 로딩 중이 아니고, 검색 결과가 없으며, 검색어가 있을 경우 NoSearchResults 표시 */}
        {!isLoading && stores.length === 0 && searchTerm ? (
          <div className="flex items-center justify-center h-[calc(100vh-485px)]">
            <NoSearchResults query={searchTerm} />
          </div>
        ) : (
          <>
            {/* 검색 결과가 있거나 로딩 중, 또는 검색어가 없는 경우 목록 표시 */}
            <div className="pt-[20px] px-[16px]">
              {/* 가게 목록 */}
              <div
                className="h-[calc(100vh-485px)] overflow-y-auto scrollbar-hide"
                ref={scrollContainerRef}
              >
                <StoreList stores={stores} />
                {/* 무한 스크롤 로더 */}
                <div ref={loaderRef} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoreMapPage;

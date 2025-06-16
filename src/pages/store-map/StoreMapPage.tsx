import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Store } from '@/types/store';
import axiosInstance from '@/api/axiosInstance';
import Header from '@/components/Header';
import SearchInput from '@/components/common/SearchInput';
import MenuCategoryCarousel from '@/components/StoreSearch/MenuCategoryCarousel';
import StoreList from '@/components/StoreSearch/StoreList';
import NoSearchResults from '@/components/common/NoSearchResults';
import Icons from '@/assets/icons';
import StoreMap from '@/components/StoreMap/StoreMap';
import { useGps } from '@/contexts/GpsContext';
import useStoreSearch from '@/hooks/useStoreSearch';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import useBottomSheet from '@/hooks/useBottomSheet';
import { categoryMapping } from '@/constants/storeMapping';
import { useGpsFetch } from '@/hooks/useGpsFetch';

// 줌 레벨에 따른 반경 계산 함수 (컴포넌트 외부로 이동)
const calculateRadius = (level: number): number => {
  if (level >= 4) return 500;
  if (level >= 3) return 1000;
  if (level >= 2) return 3000;
  return 5000;
};

// 두 좌표 간의 차이가 임계값(0.01도) 이상인지 확인
const isSignificantChange = (
  prev: { lat: number; lng: number },
  current: { lat: number; lng: number },
): boolean => {
  const latDiff = Math.abs(prev.lat - current.lat);
  const lngDiff = Math.abs(prev.lng - current.lng);
  return latDiff > 0.01 || lngDiff > 0.01;
};

const StoreMapPage = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(
    () => location.state?.selectedCategory || '전체',
  );
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const pageRef = useRef(0);
  const hasNextPageRef = useRef(true);
  const isLoadingRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 바텀시트 커스텀 훅 사용
  const headerHeight = 11 + 40 + 12 + 40 + 11;
  const {
    sheetHeight,
    setSheetHeight,
    raisedSheetHeight,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isDraggingRef,
  } = useBottomSheet(headerHeight);

  // 지도 상태 관리
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 37.495472,
    lng: 126.676902,
  }); // 기본값: 인천 서구청 좌표
  const [mapLevel, setMapLevel] = useState(3); // 기본 줌 레벨

  // 최신 상태 값을 참조하기 위한 ref들
  const mapCenterRef = useRef(mapCenter);
  const mapLevelRef = useRef(mapLevel);
  const selectedCategoryRef = useRef(selectedCategory);
  const searchTermRef = useRef('');

  const prevMapCenterRef = useRef(mapCenter);
  const isZoomingRef = useRef(false);

  // GPS 위치 hook 사용
  const {
    isGpsActive,
    address: gpsAddress,
    location: gpsLocation,
    requestGps,
  } = useGps();

  // StoreMap에서 지도 인스턴스 받아오기
  const [mapInstance, setMapInstance] = useState<any>(null);

  // 검색/주소 변환 관련 상태 및 함수 (커스텀 훅 사용)
  const {
    inputValue,
    setInputValue,
    searchTerm,
    setSearchTerm,
    isLocation,
    coordinates,
    handleSearch,
  } = useStoreSearch();

  useEffect(() => {
    mapCenterRef.current = mapCenter;
  }, [mapCenter]);
  useEffect(() => {
    mapLevelRef.current = mapLevel;
  }, [mapLevel]);
  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);
  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  // 검색 결과 좌표가 바뀌면 지도 중심 이동
  useEffect(() => {
    if (isLocation && coordinates) {
      setMapCenter({
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      });
    }
  }, [isLocation, coordinates]);
  // 검색 시 선택된 가게 초기화
  useEffect(() => {
    setSelectedStore(null);
  }, [searchTerm]);

  // API 호출 함수 (fetchStores 호출 시 페이지 관리)
  const fetchStores = useCallback(
    async (lat?: number, lng?: number) => {
      const page = pageRef.current;
      const isInitialLoadOrReset = page === 0;
      if (isLoadingRef.current) {
        console.log(
          `fetchStores: 로딩 중이므로 요청 무시 (isLoadingRef.current = ${isLoadingRef.current})`,
        );
        return;
      }

      isLoadingRef.current = true;
      setIsLoading(true);
      console.log(
        `fetchStores: API 요청 시작 (page: ${page}, isInitialLoadOrReset: ${isInitialLoadOrReset})`,
      );
      try {
        const params = {
          page: page,
          size: 10,
          latitude: lat !== undefined ? lat : mapCenterRef.current.lat,
          longitude: lng !== undefined ? lng : mapCenterRef.current.lng,
          radius: calculateRadius(mapLevelRef.current),
          category:
            selectedCategoryRef.current !== '전체'
              ? categoryMapping[selectedCategoryRef.current]
              : undefined,
          keyword: searchTermRef.current,
        };
        console.log('fetchStores - API 요청 파라미터:', params);

        const response = await axiosInstance.get('/api/v1/store/map', {
          params,
        });

        const results = response.data.results;
        const newStores =
          results && Array.isArray(results.content) ? results.content : [];
        const isLastPage =
          results &&
          results.totalPage !== undefined &&
          results.currentPage !== undefined
            ? results.totalPage <= results.currentPage + 1
            : true;

        // 중복 제거를 위해 Map 사용
        if (isInitialLoadOrReset) {
          setStores(newStores);
        } else {
          setStores((prev) => {
            const storeMap = new Map(
              prev.map((store: Store) => [store.id, store]),
            );
            newStores.forEach((store: Store) => {
              if (!storeMap.has(store.id)) {
                storeMap.set(store.id, store);
              }
            });
            return Array.from(storeMap.values());
          });
        }

        hasNextPageRef.current = !isLastPage;
        console.log(
          `fetchStores - 응답 성공. 현재 페이지: ${results.currentPage}, 마지막 페이지 여부: ${isLastPage}, hasNextPageRef.current: ${hasNextPageRef.current}`,
        );
      } catch (error) {
        console.error(
          'fetchStores - 가게 목록을 불러오는데 실패했습니다:',
          error,
        );
        // 오류 발생 시 다음 페이지 로드를 막기 위해 hasNextPageRef를 false로 설정
        hasNextPageRef.current = false;
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
        console.log('fetchStores - API 요청 완료. isLoadingRef.current: false');
      }
    },
    [setStores, setIsLoading],
  );

  // 지도 이동/줌 디바운스 관리를 위한 useRef
  const mapDebounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // 지도 영역 및 줌 레벨 변경 시 상태 업데이트 핸들러
  const handleMapChange = useCallback(
    (center: { lat: number; lng: number }, level: number) => {
      const prevLevel = mapLevelRef.current;
      const prevCenter = mapCenterRef.current;
      const isZoomChanged = prevLevel !== level;
      const isCenterChanged =
        prevCenter.lat !== center.lat || prevCenter.lng !== center.lng;

      // center(중심좌표)가 바뀌었고, level(줌레벨)은 그대로일 때만 mapCenter를 변경 (즉, 이동만 했을 때)
      if (isCenterChanged && !isZoomChanged) {
        setMapCenter(center);
        // mapLevel은 그대로 두기
      }
      // level(줌레벨)만 바뀌었을 때는 상태만 바꿈 (API 트리거 X)
      if (isZoomChanged && !isCenterChanged) {
        setMapLevel(level);
        // 페이지네이션 상태만 초기화
        pageRef.current = 0;
        hasNextPageRef.current = true;
        // 기존 데이터는 그대로 두고 fetchStores는 호출하지 않음
      }
      // 둘 다 바뀌었을 때(드래그+줌 동시): center 우선
      if (isCenterChanged && isZoomChanged) {
        setMapCenter(center);
        setMapLevel(level);
        // 페이지네이션 상태도 초기화
        pageRef.current = 0;
        hasNextPageRef.current = true;
      }
      // 둘 다 안 바뀌면 아무것도 안 함
      console.log(
        `handleMapChange: center: ${center.lat}, ${center.lng}, level: ${level}, isZoomChanged: ${isZoomChanged}, isCenterChanged: ${isCenterChanged}`,
      );
    },
    [],
  );

  // 컴포넌트 언마운트 시 모든 타임아웃 정리
  useEffect(() => {
    return () => {
      if (mapDebounceTimeoutRef.current) {
        clearTimeout(mapDebounceTimeoutRef.current);
        console.log('cleanup: mapDebounceTimeoutRef 클리어됨');
      }
    };
  }, []);

  // 1. 검색어/카테고리 변경 시 데이터 로드 (즉시, 페이지 초기화)
  useEffect(() => {
    pageRef.current = 0;
    hasNextPageRef.current = true;
    setStores([]); // 기존 데이터 초기화
    fetchStores();

    // 지도를 맨 위로 스크롤
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // 스크롤 컨테이너도 맨 위로 스크롤
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [selectedCategory, searchTerm, fetchStores]);

  // 2. 지도 중심 변경 시 데이터 로드 (디바운스, 페이지 초기화)
  useEffect(() => {
    // mapCenter가 바뀔 때만 동작 (줌만 바뀌면 동작 X)
    if (mapDebounceTimeoutRef.current) {
      clearTimeout(mapDebounceTimeoutRef.current);
      console.log('useEffect [mapChange]: 이전 디바운스 타이머 클리어됨.');
    }

    const prev = prevMapCenterRef.current;
    const latDiff = Math.abs(prev.lat - mapCenter.lat);
    const lngDiff = Math.abs(prev.lng - mapCenter.lng);

    console.log(
      `지도 이동 변화량 - 위도: ${latDiff.toFixed(4)}도, 경도: ${lngDiff.toFixed(4)}도`,
    );

    // 중심 좌표 변경이 0.01도 이상일 때만 API 요청
    if (isSignificantChange(prev, mapCenter)) {
      console.log('중심 좌표 변경이 0.01도 이상 감지됨. API 요청 예정');
      mapDebounceTimeoutRef.current = setTimeout(() => {
        console.log(
          'useEffect [mapChange]: 디바운스 완료. 지도 변경에 따른 데이터 로드 시작.',
        );
        prevMapCenterRef.current = mapCenter;
        pageRef.current = 0;
        hasNextPageRef.current = true;
        fetchStores(mapCenter.lat, mapCenter.lng);
      }, 500);
    } else {
      console.log('중심 좌표 변경이 0.01도 미만. API 요청하지 않음');
    }

    return () => {
      if (mapDebounceTimeoutRef.current) {
        clearTimeout(mapDebounceTimeoutRef.current);
        console.log('useEffect [mapChange] cleanup: 타이머 클리어됨.');
      }
    };
  }, [mapCenter, fetchStores]);

  // useInfiniteScroll 훅 사용 (무한스크롤)
  const { loaderRef } = useInfiniteScroll({
    onIntersect: () => {
      if (!isZoomingRef.current) {
        const nextPage = pageRef.current + 1;
        pageRef.current = nextPage;
        fetchStores(mapCenter.lat, mapCenter.lng);
      }
    },
    isLoadingRef,
    hasNextPageRef,
    root: scrollContainerRef.current,
    threshold: 0.2,
  });

  // 헤더 및 검색 입력창을 포함하는 고정된 상단 영역의 높이를 계산
  const mapAreaHeight = `calc(100vh - ${headerHeight}px - ${sheetHeight}px)`; // 바텀시트 높이에 따라 동적으로 계산

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(
    (marker: { lat: number; lng: number; name: string }) => {
      // markers 배열에서 클릭된 마커의 전체 Store 객체를 찾습니다.
      const foundStore = stores.find(
        (store) =>
          store.latitude === marker.lat && store.longitude === marker.lng,
      );
      if (foundStore) {
        setSelectedStore(foundStore); // 선택된 가맹점 상태 업데이트
        setSheetHeight(518); // 마커 클릭 시 바텀 시트 전체 높이로 확장
      } else {
        setSelectedStore(null); // 찾지 못하면 초기화
      }
    },
    [stores],
  ); // stores 배열이 변경될 수 있으므로 의존성 배열에 추가

  const handleGpsClick = useGpsFetch((lat, lng) => {
    pageRef.current = 0;
    hasNextPageRef.current = true;
    setStores([]);
    setMapCenter({ lat, lng });
    if (mapInstance && window.kakao && window.kakao.maps) {
      const kakaoCenter = new window.kakao.maps.LatLng(lat, lng);
      mapInstance.setCenter(kakaoCenter);
    }
    fetchStores(lat, lng);
  }, requestGps);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col items-center w-full mt-[11px] z-[100]">
        <Header title="가맹점 지도" location={gpsAddress} />

        <div className="flex gap-[12px] px-[20px] w-full">
          <button onClick={handleGpsClick}>
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
      <div
        className="fixed left-0 mt-[14px] w-full z-[1]"
        style={{
          top: headerHeight,
          height: mapAreaHeight,
          transition: isDraggingRef.current ? 'none' : 'all 0.3s ease-out',
        }}
      >
        <StoreMap
          stores={selectedStore ? [selectedStore] : stores}
          latestBatchStores={
            selectedStore ? [selectedStore] : stores.slice(-10)
          }
          center={
            isGpsActive
              ? { lat: gpsLocation.latitude, lng: gpsLocation.longitude }
              : mapCenter
          }
          level={mapLevel}
          onMapChange={handleMapChange}
          onMarkerClick={handleMarkerClick}
          onMapClick={() => setSelectedStore(null)}
          onMapLoad={setMapInstance}
        />
      </div>

      {/* 바텀시트 영역 */}
      <div
        className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg z-[50] flex flex-col"
        style={{
          height: sheetHeight,
          transition: isDraggingRef.current ? 'none' : 'height 0.3s ease-out',
          boxShadow: '0px -13px 12px 0px rgba(0, 0, 0, 0.10)',
        }}
      >
        {/* 드래그 핸들 */}
        <div
          className="flex justify-center items-center py-2 cursor-grab active:cursor-grabbing flex-shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-[85px] h-[4px] rounded-md bg-[#D9D9D9]" />
        </div>

        {/* 카테고리 캐러셀 */}
        <div className="flex flex-col items-center w-full bg-white flex-shrink-0">
          <MenuCategoryCarousel
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setSelectedStore(null);
              setMapLevel(3);
            }}
          />
        </div>

        {/* 캐러셀 아래 영역 전체 */}
        {!isLoading && stores.length === 0 ? (
          <div
            className="mt-[32px] overflow-hidden overflow-y-auto"
            ref={scrollContainerRef}
          >
            {searchTerm ? (
              <NoSearchResults type="search" query={searchTerm} />
            ) : (
              <NoSearchResults type="nearby" />
            )}
          </div>
        ) : (
          <div className="pt-[16px] px-[16px] overflow-hidden flex-grow flex flex-col">
            {/* 가게 목록 */}
            <div
              className="h-full overflow-y-auto scrollbar-hide flex-grow"
              ref={scrollContainerRef}
            >
              <StoreList stores={selectedStore ? [selectedStore] : stores} />
              {/* 무한 스크롤 로더 */}
              <div ref={loaderRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreMapPage;

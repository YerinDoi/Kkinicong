import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import SearchOnMapBtn from '@/components/StoreMap/SearchOnMapBtn';

// 줌 레벨에 따른 반경 계산 함수 (컴포넌트 외부로 이동)
const calculateRadius = (level: number): number => {
  if (level >= 3) return 1000;
  if (level >= 2) return 3000;
  return 5000;
};

const StoreMapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const searchTriggeredRef = useRef(false);
  const isHandlingSearchRef = useRef(false);

  // 바텀시트 커스텀 훅 사용
  const headerHeight = 11 + 40 + 12 + 40 + 11;
  const {
    sheetHeight,
    setSheetHeight,
    raisedSheetHeight,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    isDraggingRef,
  } = useBottomSheet(headerHeight);

  // 지도 상태 관리
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 37.545226,
    lng: 126.676459,
  });

  // StoreMap에서 지도 인스턴스 받아오기
  const [mapInstance, setMapInstance] = useState<any>(null);

  const ignoreNextMapMove = useRef(false);

  // 지도 범위 재설정 관련 상태 추가
  const [shouldAutoFitBounds, setShouldAutoFitBounds] = useState(true);
  const [lastStoresCount, setLastStoresCount] = useState(0);

  const moveMap = useCallback(
    (center: { lat: number; lng: number }) => {
      ignoreNextMapMove.current = true;
      setMapCenter(center);
      // mapInstance가 있으면 직접 지도 이동
      if (mapInstance && window.kakao && window.kakao.maps) {
        const moveLatLng = new window.kakao.maps.LatLng(center.lat, center.lng);
        mapInstance.setCenter(moveLatLng);
      }
    },
    [mapInstance],
  );

  // 지도 상태 관리
  const [mapLevel, setMapLevel] = useState(3); // 기본 줌 레벨

  // 최신 상태 값을 참조하기 위한 ref들
  const mapCenterRef = useRef(mapCenter);
  const mapLevelRef = useRef(mapLevel);
  const selectedCategoryRef = useRef(selectedCategory);
  const searchTermRef = useRef('');

  const isZoomingRef = useRef(false);

  // GPS 위치 hook 사용
  const {
    isGpsActive,
    address: gpsAddress,
    location: gpsLocation,
    isLocationReady,
    requestGps,
  } = useGps();

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

  // 최신 isLocation 값을 ref에 저장하여 콜백에서 사용
  const isLocationRef = useRef(isLocation);
  useEffect(() => {
    isLocationRef.current = isLocation;
  }, [isLocation]);

  useEffect(() => {
    mapCenterRef.current = mapCenter;
  }, [mapCenter]);
  useEffect(() => {
    mapLevelRef.current = mapLevel;
  }, [mapLevel]);

  useEffect(() => {
    if (!isGpsActive && gpsLocation) {
      console.log('[초기 지도 위치] 즐겨찾기 위치로 설정됨:', gpsLocation);
      setMapCenter({
        lat: gpsLocation.latitude,
        lng: gpsLocation.longitude,
      });
    }
  }, [gpsLocation, isGpsActive]);

  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);
  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  // 메인페이지에서 검색어 받고, 검색 실행
  useEffect(() => {
    const termFromState = location.state?.searchTerm;
    const centerFromState = location.state?.center;
    if (termFromState) {
      setInputValue(termFromState);
      if (centerFromState) {
        setMapCenter(centerFromState); // 중심 좌표를 state에서 받은 값으로 세팅
      }
      handleSearchAndFitBounds(termFromState, centerFromState);

      // location.state에서 searchTerm, center 제거
      const { searchTerm, center, ...restState } = location.state;
      navigate(location.pathname, { state: restState, replace: true });
    }
  }, [location.state]);

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

  // 선택된 가맹점이 변경될 때 바텀시트 높이 조정
  useEffect(() => {
    if (selectedStore) {
      // 선택된 가맹점이 있으면 바텀시트 확장 (300px)
      setSheetHeight(300);
    } else {
      // 선택된 가맹점이 없으면 기본 높이로 되돌림
      setSheetHeight(raisedSheetHeight);
    }
  }, [selectedStore, raisedSheetHeight]);

  // API 호출 함수 (fetchStores 호출 시 페이지 관리)
  const fetchStores = useCallback(
    async (params: {
      latitude: number;
      longitude: number;
      keyword?: string;
      radius?: number;
    }) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      setIsLoading(true);
      const page = pageRef.current;
      const isInitialLoadOrReset = page === 0;
      try {
        // 일반 키워드 검색인지 판별 (키워드가 있고, 지역명 검색이 아닐 때)
        const isGeneralKeywordSearch =
          !!params.keyword && !isLocationRef.current;

        const requestParams = {
          page: page,
          size: 10,
          latitude: params.latitude,
          longitude: params.longitude,
          keyword: params.keyword,
          radius:
            params.radius !== undefined
              ? params.radius
              : isGeneralKeywordSearch
                ? 20000 // 일반 키워드 검색: 20km
                : calculateRadius(mapLevelRef.current), // 그 외: 지도 레벨 기준
          category:
            selectedCategoryRef.current !== '전체'
              ? categoryMapping[selectedCategoryRef.current]
              : undefined,
        };

        console.log('fetchStores - API 요청 파라미터:', requestParams);

        const response = await axiosInstance.get('/api/v1/store/map', {
          params: requestParams,
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
  const [isMapMoved, setIsMapMoved] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleMapChange = useCallback(
    (center: { lat: number; lng: number }, level: number, byUser?: boolean) => {
      console.log('[handleMapChange 호출]', {
        center,
        level,
        byUser,
        ignore: ignoreNextMapMove.current,
      });
      const prevLevel = mapLevelRef.current;
      const prevCenter = mapCenterRef.current;
      const isZoomChanged = prevLevel !== level;
      const isCenterChanged =
        prevCenter.lat !== center.lat || prevCenter.lng !== center.lng;

      if (isCenterChanged && !isZoomChanged) {
        setMapCenter(center);
      }
      if (isZoomChanged && !isCenterChanged) {
        setMapLevel(level);
      }
      if (isCenterChanged && isZoomChanged) {
        setMapCenter(center);
        setMapLevel(level);
        pageRef.current = 0;
        hasNextPageRef.current = true;
      }
      if (byUser && !isSearching && !ignoreNextMapMove.current)
        setIsMapMoved(true);
      ignoreNextMapMove.current = false; // 한 번만 무시
    },
    [isSearching],
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

  // 1. 카테고리 변경 시 데이터 로드
  useEffect(() => {
    // 1. 카테고리 변경 시 데이터 로드
    if (mapInstance) {
      // mapInstance가 준비된 이후에만 실행
      pageRef.current = 0;
      hasNextPageRef.current = true;
      setStores([]);
      searchTriggeredRef.current = true; // 카테고리 변경 시 검색 트리거
      fetchStores({
        latitude: mapCenterRef.current.lat,
        longitude: mapCenterRef.current.lng,
        keyword: isLocationRef.current ? undefined : searchTermRef.current,
      });
    }
  }, [selectedCategory]);

  // useInfiniteScroll 훅 사용 (무한스크롤)
  const { loaderRef } = useInfiniteScroll({
    onIntersect: () => {
      if (!isZoomingRef.current && !selectedStore && isLocationReady) {
        const nextPage = pageRef.current + 1;
        pageRef.current = nextPage;
        fetchStores({
          latitude: mapCenterRef.current.lat,
          longitude: mapCenterRef.current.lng,
          keyword: isLocationRef.current ? undefined : searchTermRef.current,
        });
      }
    },
    isLoadingRef,
    hasNextPageRef,
    root: null, // viewport 기준으로 안정적
    threshold: 0.1, // 더 민감하게 설정
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
        setSheetHeight(300); // 마커 클릭 시 바텀 시트 전체 높이로 확장
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
    setSearchTerm('');
    setInputValue('');
    setIsMapMoved(false); // GPS 이동 시 버튼 숨김
    setShouldAutoFitBounds(true); // GPS 이동 시 자동 범위 재설정 활성화
    searchTriggeredRef.current = true; // GPS 이동 시 검색 트리거
  }, requestGps);

  // 검색 실행 시, 결과에 맞춰 지도 범위를 재설정 (수정된 로직)
  useEffect(() => {
    // 검색이 트리거되었고, 자동 범위 재설정이 활성화되어 있고, 결과(가게)가 있으며, 지도 인스턴스가 준비되었을 때만 동작
    if (
      searchTriggeredRef.current &&
      shouldAutoFitBounds &&
      stores.length > 0 &&
      mapInstance
    ) {
      // 2개 이상의 결과가 있을 때만 모든 결과가 보이도록 지도 범위 조정
      if (stores.length > 1) {
        console.log('지도 범위 재설정 실행:', stores.length, '개의 마커');
        // 지도 범위 재설정 시 사용자 조작으로 인식하지 않도록 설정
        ignoreNextMapMove.current = true;
        const bounds = new window.kakao.maps.LatLngBounds();
        stores.forEach((store: Store) => {
          bounds.extend(
            new window.kakao.maps.LatLng(store.latitude, store.longitude),
          );
        });
        mapInstance.setBounds(bounds);
      }
      // 범위 재설정 후 비활성화
      setShouldAutoFitBounds(false);
      searchTriggeredRef.current = false;
    }
  }, [stores, mapInstance, shouldAutoFitBounds]);

  // 새로운 마커가 추가되었을 때 자동 범위 재설정 활성화
  useEffect(() => {
    if (stores.length > lastStoresCount && stores.length > 1) {
      console.log('새로운 마커 추가됨, 자동 범위 재설정 활성화');
      setShouldAutoFitBounds(true);
      searchTriggeredRef.current = true; // 새로운 마커 추가 시 검색 트리거
    }
    setLastStoresCount(stores.length);
  }, [stores.length, lastStoresCount]);

  // 카테고리 변경 시 버튼 숨김
  useEffect(() => {
    setIsMapMoved(false);
    setShouldAutoFitBounds(true); // 카테고리 변경 시 자동 범위 재설정 활성화
  }, [selectedCategory]);

  // GPS 위치가 준비된 후 fetchStores 강제 호출
  useEffect(() => {
    console.log('[GPS 위치 준비 useEffect] 실행됨:', {
      gpsLocation,
      isGpsActive,
      isLocationReady,
      mapCenter,
      storesLength: stores.length,
    });

    // GPS 위치가 준비된 후에만 데이터 로드 (초기 로딩 시에만)
    if (isLocationReady && stores.length === 0) {
      // 검색어가 state에 있으면 여기서 fetchStores 실행하지 않음
      if (location.state?.searchTerm) return;
      if (gpsLocation) {
        // GPS 위치가 있으면 해당 위치로 API 호출
        console.log('[GPS 위치 준비] fetchStores 강제 호출:', gpsLocation);
        pageRef.current = 0;
        hasNextPageRef.current = true;
        setStores([]);
        fetchStores({
          latitude: gpsLocation.latitude,
          longitude: gpsLocation.longitude,
        });
        setMapCenter({
          lat: gpsLocation.latitude,
          lng: gpsLocation.longitude,
        });
      } else {
        // GPS 위치가 없으면 현재 지도 중심으로 API 호출
        console.log(
          '[GPS 위치 준비] 현재 지도 중심으로 fetchStores 호출:',
          mapCenter,
        );
        pageRef.current = 0;
        hasNextPageRef.current = true;
        setStores([]);
        fetchStores({
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
        });
      }
    }
  }, [isLocationReady, gpsLocation]); // mapCenter 제거

  const handleSearchAndFitBounds = async (
    term?: string,
    centerOverride?: { lat: number; lng: number },
  ) => {
    setIsSearching(true);
    setIsMapMoved(false); // 검색 시 버튼 숨김
    setShouldAutoFitBounds(true); // 검색 시 자동 범위 재설정 활성화

    const termToSearch = typeof term === 'string' ? term : inputValue;
    if (!termToSearch.trim()) {
      setSearchTerm('');
      pageRef.current = 0;
      hasNextPageRef.current = true;
      setStores([]);
      fetchStores({
        latitude: mapCenter.lat,
        longitude: mapCenter.lng,
      });
      setIsSearching(false);
      return;
    }

    // centerOverride가 있으면 그걸, 없으면 기존 mapCenter 사용
    const center = centerOverride || mapCenter;

    pageRef.current = 0;
    hasNextPageRef.current = true;
    setStores([]);
    searchTriggeredRef.current = true;
    isHandlingSearchRef.current = true;

    const { newMapCenter } = await handleSearch(
      termToSearch.trim(),
      { latitude: center.lat, longitude: center.lng },
      isGpsActive,
    );
    moveMap(newMapCenter);

    fetchStores({
      latitude: newMapCenter.lat,
      longitude: newMapCenter.lng,
      ...(isLocationRef.current ? {} : { keyword: termToSearch }),
    });
    setIsSearching(false);
  };

  const handleSearchOnMap = (lat: number, lng: number) => {
    pageRef.current = 0;
    hasNextPageRef.current = true;
    setStores([]);
    fetchStores({
      latitude: lat,
      longitude: lng,
      ...(isLocationRef.current ? {} : { keyword: searchTermRef.current }),
    });
    setIsMapMoved(false);
  };

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
            onSearch={() => handleSearchAndFitBounds()}
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
            isGpsActive && gpsLocation
              ? { lat: gpsLocation.latitude, lng: gpsLocation.longitude }
              : mapCenter
          }
          level={mapLevel}
          onMapChange={handleMapChange}
          onMarkerClick={handleMarkerClick}
          onMapClick={() => {
            setSelectedStore(null);
          }}
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
          className="touch-none flex justify-center items-center py-2 cursor-grab active:cursor-grabbing flex-shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div className="w-[85px] h-[4px] rounded-md bg-[#D9D9D9]" />
        </div>

        {/* 카테고리 캐러셀 */}
        <div className="flex flex-col items-center w-full bg-white flex-shrink-0">
          <MenuCategoryCarousel
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              //setSheetHeight(518);
              setSelectedCategory(cat);
              setSelectedStore(null);
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
              <div ref={loaderRef} style={{ height: '20px' }} />
            </div>
          </div>
        )}
      </div>

      {/* 지도 위에 버튼을 화면 상단에 고정해서 표시 */}
      {isMapMoved && (
        <div className="absolute left-1/2 top-[145px] -translate-x-1/2 z-[1000]">
          <SearchOnMapBtn
            lat={mapCenter.lat}
            lng={mapCenter.lng}
            onClick={handleSearchOnMap}
          />
        </div>
      )}
    </div>
  );
};

export default StoreMapPage;

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
import useUserLocation from '@/hooks/useUserLocation';

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
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const pageRef = useRef(0);
  const hasNextPageRef = useRef(true);
  const isLoadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 바텀시트 높이 관리
  const [sheetHeight, setSheetHeight] = useState(0); // 초기 높이를 0으로 설정 (useEffect에서 동적으로 설정)
  const initialSheetHeightRef = useRef(0);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);

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
  const searchTermRef = useRef(searchTerm);

  const prevMapCenterRef = useRef(mapCenter);
  const isZoomingRef = useRef(false);

  // 헤더 및 검색 입력창을 포함하는 고정된 상단 영역의 높이를 계산
  const headerHeight = 11 + 40 + 12 + 40 + 11; // mt-[11px] + Header(40) + gap-[12px] + SearchInput(40) + 여유분

  // 바텀시트가 올라갔을 때(지도가 224px일 때)의 바텀시트 높이 (동적으로 계산)
  const [raisedSheetHeight, setRaisedSheetHeight] = useState(0);

  // GPS 위치 hook 사용
  const {
    isGpsActive,
    address: gpsAddress,
    location: gpsLocation,
    requestGps,
    error: gpsError,
    isLoading: gpsLoading,
  } = useUserLocation();

  // StoreMap에서 지도 인스턴스 받아오기
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    const calculateAndSetInitialHeights = () => {
      // 지도가 224px일 때의 바텀시트 높이
      const calculatedRaisedHeight = window.innerHeight - headerHeight - 224;
      setRaisedSheetHeight(calculatedRaisedHeight);

      // 컴포넌트 마운트 시 초기 바텀시트 높이를 올린 상태로 설정
      if (sheetHeight === 0) {
        // 최초 렌더링 시에만 초기 높이 설정
        setSheetHeight(calculatedRaisedHeight);
      }
    };

    calculateAndSetInitialHeights();
    window.addEventListener('resize', calculateAndSetInitialHeights);

    return () => {
      window.removeEventListener('resize', calculateAndSetInitialHeights);
    };
  }, [headerHeight, sheetHeight]); // sheetHeight를 의존성에 추가하여 최초 설정 이후 재계산 방지

  // 바텀시트가 내려갔을 때의 고정된 높이
  const LOWERED_SHEET_HEIGHT_FIXED = 144;

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

  // 카카오 API를 사용하여 주소 검색 및 위경도 변환
  const searchAddress = async (keyword: string) => {
    try {
      const isAddress = /동$|구$|역$/.test(keyword);

      if (!isAddress) {
        setIsLocation(false);
        return { isLocation: false, coordinates: null };
      }

      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}`,
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
          },
        },
      );
      const data = await response.json();

      if (data.documents && data.documents.length > 0) {
        const { y: latitude, x: longitude } = data.documents[0];
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
    const { isLocation, coordinates: locationCoordinates } =
      await searchAddress(searchInput);

    setSearchTerm(searchInput);
    setSelectedStore(null);

    if (isLocation && locationCoordinates) {
      setMapCenter({
        lat: locationCoordinates.latitude,
        lng: locationCoordinates.longitude,
      });
    }
  };

  // API 호출 함수 (fetchStores 호출 시 페이지 관리)
  const fetchStores = useCallback(
    async (page: number, isInitialLoadOrReset: boolean) => {
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
          latitude: mapCenterRef.current.lat,
          longitude: mapCenterRef.current.lng,
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
    [setStores, setIsLoading], // setStores, setIsLoading는 안정적인 참조이므로 deps에 포함
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
    console.log(
      'useEffect [search/category]: 검색어 또는 카테고리 변경 감지. 즉시 데이터 로드 시작.',
    );
    pageRef.current = 0;
    hasNextPageRef.current = true;
    setStores([]); // 기존 데이터 초기화
    fetchStores(0, true);

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
        fetchStores(0, true);
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

  // 3. 무한 스크롤 로직 (다음 페이지 로드)
  useEffect(() => {
    if (!loaderRef.current) {
      console.log(
        'useEffect [infiniteScroll]: loaderRef가 없어 무한 스크롤 observer 설정 건너뜀.',
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        console.log(
          `useEffect [infiniteScroll]: IntersectionObserver 트리거됨. isIntersecting: ${target.isIntersecting}, isLoading: ${isLoadingRef.current}, hasNextPage: ${hasNextPageRef.current}`,
        );
        if (
          target.isIntersecting &&
          !isLoadingRef.current &&
          hasNextPageRef.current &&
          !isZoomingRef.current // 줌 변경 중이 아닐 때만 스크롤 로드
        ) {
          console.log(
            'useEffect [infiniteScroll]: 무한 스크롤 조건 만족. 다음 페이지 로드 시작.',
          );
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage; // pageRef.current 먼저 업데이트
          console.log(
            `useEffect [infiniteScroll]: pageRef.current 업데이트됨: ${pageRef.current}`,
          );

          fetchStores(nextPage, false); // 다음 페이지 로드, 기존 목록에 추가
        }
      },
      { threshold: 0.2, root: scrollContainerRef.current },
    );

    observer.observe(loaderRef.current);
    observerRef.current = observer;
    console.log('useEffect [infiniteScroll]: IntersectionObserver 설정 완료.');

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        console.log(
          'useEffect [infiniteScroll] cleanup: IntersectionObserver 연결 해제됨.',
        );
      }
    };
  }, [fetchStores]); // fetchStores만 의존성으로 포함 (ref를 통해 최신 값 참조)

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    initialSheetHeightRef.current = sheetHeight;
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const deltaY = e.touches[0].clientY - startYRef.current;
    const newHeight = initialSheetHeightRef.current - deltaY;
    // 최소(올린 상태) 높이 제한은 동적으로 계산된 값, 최대(내린 상태) 높이 제한은 고정된 값
    const clampedHeight = Math.max(
      LOWERED_SHEET_HEIGHT_FIXED,
      Math.min(raisedSheetHeight, newHeight),
    );
    setSheetHeight(clampedHeight);
    console.log(
      `handleTouchMove: newHeight=${newHeight}, clampedHeight=${clampedHeight}`,
    ); // 디버깅 로그 추가
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    // 드래그가 끝났을 때 특정 위치로 스냅
    const RAISED_SNAP_HEIGHT = raisedSheetHeight; // 동적으로 계산된 올린 상태 높이
    const LOWERED_SNAP_SNAP_HEIGHT = LOWERED_SHEET_HEIGHT_FIXED; // 고정된 내린 상태 높이
    // 스냅 임계점을 중간으로 설정 (평균)
    const halfway = (RAISED_SNAP_HEIGHT + LOWERED_SNAP_SNAP_HEIGHT) / 2;

    console.log(
      `handleTouchEnd: sheetHeight=${sheetHeight}, halfway=${halfway}, RAISED_SNAP_HEIGHT=${RAISED_SNAP_HEIGHT}, LOWERED_SNAP_SNAP_HEIGHT=${LOWERED_SNAP_SNAP_HEIGHT}`,
    ); // 디버깅 로그 추가

    if (sheetHeight < halfway) {
      console.log(
        `handleTouchEnd: Snapping to LOWERED_SNAP_SNAP_HEIGHT (${LOWERED_SNAP_SNAP_HEIGHT})`,
      ); // 디버깅 로그 추가
      setSheetHeight(LOWERED_SNAP_SNAP_HEIGHT); // 사용자가 바텀 시트를 '내려서' 짧은 상태로 가려 할 때 144px로 스냅
    } else {
      console.log(
        `handleTouchEnd: Snapping to RAISED_SNAP_HEIGHT (${RAISED_SNAP_HEIGHT})`,
      ); // 디버깅 로그 추가
      setSheetHeight(RAISED_SNAP_HEIGHT); // 사용자가 바텀 시트를 '올려서' 긴 상태로 가려 할 때 raisedSheetHeight로 스냅
    }
  };

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

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col items-center w-full mt-[11px] z-[100]">
        <Header title="가맹점 지도" location={gpsAddress} />

        <div className="flex gap-[12px] px-[20px] w-full">
          <button
            onClick={() =>
              requestGps((lat, lng) => {
                const newCenter = {
                  lat: lat + Math.random() * 1e-10,
                  lng: lng + Math.random() * 1e-10,
                };
                setMapCenter(newCenter);
                if (mapInstance && window.kakao && window.kakao.maps) {
                  const kakaoCenter = new window.kakao.maps.LatLng(lat, lng);
                  mapInstance.setCenter(kakaoCenter);
                }
                pageRef.current = 0;
                hasNextPageRef.current = true;
                setStores([]);
                fetchStores(0, true);
              })
            }
          >
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
        className="fixed left-0 mt-[12px] w-full z-[1]"
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
              setMapCenter({
                lat: 37.495472,
                lng: 126.676902,
              });
              setMapLevel(3);
            }}
          />
        </div>

        {/* 캐러셀 아래 영역 전체 */}
        {!isLoading && stores.length === 0 ? (
          <div className="mt-[32px]">
            {searchTerm ? (
              <NoSearchResults type="search" query={searchTerm} />
            ) : (
              <NoSearchResults type="nearby" />
            )}
          </div>
        ) : (
          <div className="pt-[20px] px-[16px] overflow-hidden flex-grow flex flex-col">
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

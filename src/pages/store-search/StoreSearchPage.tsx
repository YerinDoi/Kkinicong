import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import Header from '@/components/Header';
import SearchInput from '@/components/common/SearchInput';
import MenuCategoryCarousel from '@/components/StoreSearch/MenuCategoryCarousel';
import Dropdown from '@/components/common/Dropdown';
import StoreList from '@/components/StoreSearch/StoreList';
import NoSearchResults from '@/components/common/NoSearchResults';
import Icons from '@/assets/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGps } from '@/contexts/GpsContext';
import { useGpsFetch } from '@/hooks/useGpsFetch';
import useStoreSearch from '@/hooks/useStoreSearch';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { categoryMapping, sortMapping } from '@/constants/storeMapping';
import { Store } from '@/types/store';

const StoreSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const {
    address: gpsAddress,
    location: gpsLocation,
    isLocationReady,
    requestGps,
  } = useGps();

  // 초기화 가드들
  const initDoneRef = useRef(false);           // 초기 카테고리 확정 전엔 fetch 막기
  const didInitCategoryRef = useRef(false);    // StrictMode 2회 호출 차단
  const requestSeqRef = useRef(0);             // 구요청 응답 무시용 시퀀스

  // UI 표시용 상태
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sort, setSort] = useState('가까운 순');
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 페이징/스크롤 관련 ref
  const pageRef = useRef(0);
  const hasNextPageRef = useRef(true);
  const isLoadingRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 검색 훅
  const {
    inputValue,
    setInputValue,
    searchTerm,
    setSearchTerm,
    isLocation,
    coordinates,
    handleSearch,
  } = useStoreSearch();

  // 1) 초기 카테고리 동기 확정 (fromHome → saved → '전체'), StrictMode 가드
  useLayoutEffect(() => {
    if (didInitCategoryRef.current) return; // StrictMode 2회 호출 방지
    didInitCategoryRef.current = true;

    const fromHome = location.state?.selectedCategory as string | undefined;
    const saved = localStorage.getItem('selectedCategory') || undefined;

    const initial = fromHome ?? saved ?? '전체';
    setSelectedCategory(initial);

    if (fromHome) {
      // 일회성으로 state 제거 (두 번째 호출 때 다시 덮어쓰지 않도록)
      navigate(location.pathname, { replace: true, state: {} });
    }

    initDoneRef.current = true; // 초기화 완료 신호
  }, [location.pathname, location.state, navigate]);

  // 2) 초기화 이후에만 최근 선택 카테고리를 저장
  useEffect(() => {
    if (!initDoneRef.current) return;
    localStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  // 3) 데이터 페치 함수 (force 옵션 + 구요청 응답 무시)
  const fetchStores = useCallback(
    async (params?: any, options?: { force?: boolean } = {}) => {
      const { force = false } = options;

      // 로딩 중인데 강제요청이 아니라면 스킵
      if (isLoadingRef.current && !force) return;

      isLoadingRef.current = true;
      setIsLoading(true);

      // 요청 시퀀스 번호 부여
      const mySeq = ++requestSeqRef.current;

      const page = pageRef.current;
      const requestParams: any = {
        page,
        size: 10,
        sort: sortMapping[sort],
      };

      // 기본 category는 현재 상태 기준
      if (selectedCategory !== '전체') {
        requestParams.category = categoryMapping[selectedCategory];
      }

      // override 병합 (이번 요청에 반드시 쓸 파라미터)
      if (params) Object.assign(requestParams, params);

      // undefined/null 값은 쿼리에서 제거
      if (requestParams.category == null) delete requestParams.category;

      // 위치/검색어 기본 로직: override에 없는 경우에만 채움
      if (!params) {
        if (searchTerm) {
          if (isLocation && coordinates) {
            requestParams.latitude = coordinates.latitude;
            requestParams.longitude = coordinates.longitude;
          } else {
            requestParams.keyword = searchTerm;
            if (gpsLocation) {
              requestParams.latitude = gpsLocation.latitude;
              requestParams.longitude = gpsLocation.longitude;
            } else {
              requestParams.latitude = null;
              requestParams.longitude = null;
            }
          }
        } else if (isLocation && coordinates) {
          requestParams.latitude = coordinates.latitude;
          requestParams.longitude = coordinates.longitude;
        } else if (gpsLocation) {
          requestParams.latitude = gpsLocation.latitude;
          requestParams.longitude = gpsLocation.longitude;
        } else {
          requestParams.latitude = null;
          requestParams.longitude = null;
        }
      }

      try {
        const res = await axiosInstance.get('/api/v1/store/list', {
          params: requestParams,
        });

        // 구요청 응답은 무시
        if (mySeq !== requestSeqRef.current) return;

        const newStores = res.data.results?.content || [];
        const isLastPage =
          res.data.results?.totalPage <= res.data.results?.currentPage + 1;

        setStores((prev: Store[]) => {
          const merged: Store[] = page === 0 ? newStores : [...prev, ...newStores];
          return Array.from(new Map(merged.map((s) => [s.id, s])).values());
        });

        hasNextPageRef.current = !isLastPage;
      } catch (err) {
        // 구요청 에러는 무시
        if (mySeq === requestSeqRef.current) {
          console.error('가게 목록 불러오기 실패:', err);
          if (page === 0) setStores([]);
          hasNextPageRef.current = false;
        }
      } finally {
        if (mySeq === requestSeqRef.current) {
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      }
    },
    [
      selectedCategory,
      sort,
      isLocation,
      coordinates,
      searchTerm,
      gpsLocation,
    ]
  );

  // 4) 공통 reset + fetch (강제요청)
  const resetAndFetch = () => {
  pageRef.current = 0;
  hasNextPageRef.current = true;
  setStores([]);

  const categoryParam =
    selectedCategory !== '전체' ? categoryMapping[selectedCategory] : undefined;

  const overrides: any = { category: categoryParam };

  if (isLocation && coordinates) {
    overrides.latitude = coordinates.latitude;
    overrides.longitude = coordinates.longitude;
  } else if (gpsLocation) {
    overrides.latitude = gpsLocation.latitude;
    overrides.longitude = gpsLocation.longitude;
  } else {
    overrides.latitude = null;
    overrides.longitude = null;
  }

  fetchStores(overrides, { force: true });
};


  // 5) 단 하나의 effect에서만 fetch 실행 (초기/변경 모두 포함)
  useEffect(() => {
    if (!initDoneRef.current) return;  // 초기 카테고리 확정 전이면 대기
    if (!isLocationReady) return;      // GPS 준비 전이면 대기

    const categoryParam =
      selectedCategory !== '전체' ? categoryMapping[selectedCategory] : undefined;

    resetAndFetch({ category: categoryParam });
  }, [
    selectedCategory,  // 홈에서 넘어온 값/페이지 내 변경 둘 다 잡힘
    sort,
    isLocation,
    coordinates,
    searchTerm,
    isLocationReady,
    fetchStores,
  ]);

  // 무한 스크롤
  const { loaderRef } = useInfiniteScroll({
    onIntersect: () => {
      if (isLocationReady) {
        pageRef.current += 1;
        fetchStores();
      }
    },
    isLoadingRef,
    hasNextPageRef,
    root: null,
    threshold: 0.1,
  });

  // GPS 버튼 강제 새로고침
  const handleGpsClick = useGpsFetch((lat, lng) => {
    resetAndFetch({ latitude: lat, longitude: lng });
  }, requestGps);

  // 검색 버튼
  const handleSearchClick = async () => {
    await handleSearch(inputValue, gpsLocation, true);
  };

  return (
    <div className="real-vh">
      <div className="flex flex-col items-center w-full shadow-bottom shrink-0">
        <Header title="가맹점 찾기" location={gpsAddress} />
        <div className="flex gap-[12px] px-[20px] w-full">
          <button onClick={handleGpsClick}>
            <Icons name="gps" />
          </button>
          <SearchInput
            placeholder="가게이름을 검색하세요"
            value={inputValue}
            onChange={setInputValue}
            onSearch={handleSearchClick}
          />
        </div>
        <MenuCategoryCarousel
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {!isLoading && stores.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(var(--vh,1vh)*100-240px)]">
          {searchTerm && !isLocation ? (
            <NoSearchResults type="search" query={searchTerm} />
          ) : (
            <NoSearchResults type="nearby" />
          )}
        </div>
      ) : (
        <div className="pt-[20px] px-[16px]">
          <div className="flex justify-end pb-[20px]">
            <Dropdown
              options={[
                '가까운 순',
                '리뷰 많은 순',
                '별점 높은 순',
                '조회수 순',
              ]}
              onSelect={setSort}
            />
          </div>
          <div
            className="h-[calc(var(--vh,1vh)*100-310px)] overflow-y-auto scrollbar-hide"
            ref={scrollContainerRef}
          >
            <StoreList stores={stores} />
            <div ref={loaderRef} style={{ height: '20px' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreSearchPage;

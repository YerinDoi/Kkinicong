import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';
import Header from '@/components/Header';
import SearchInput from '@/components/common/SearchInput';
import MenuCategoryCarousel from '@/components/StoreSearch/MenuCategoryCarousel';
import Dropdown from '@/components/common/Dropdown';
import StoreList from '@/components/StoreSearch/StoreList';
import NoSearchResults from '@/components/common/NoSearchResults';
import Icons from '@/assets/icons';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGps } from '@/contexts/GpsContext';
import { useGpsFetch } from '@/hooks/useGpsFetch';
import useStoreSearch from '@/hooks/useStoreSearch';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { categoryMapping, sortMapping } from '@/constants/storeMapping';
import { Store } from '@/types/store';

// interface FetchParams {
//   latitude?: number;
//   longitude?: number;
//   keyword?: string;
//   radius?: number;
//   [key: string]: any;
// }

const StoreSearchPage = () => {
  const location = useLocation();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const {
    address: gpsAddress,
    location: gpsLocation,
    isLocationReady,
    requestGps,
  } = useGps();
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.selectedCategory || '전체',
  );
  const [sort, setSort] = useState('가까운 순');
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pageRef = useRef(0);
  const hasNextPageRef = useRef(true);
  const isLoadingRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    inputValue,
    setInputValue,
    searchTerm,
    setSearchTerm,
    isLocation,
    coordinates,
    handleSearch,
  } = useStoreSearch();

  const fetchStores = useCallback(
    async (params?: any) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoading(true);

      const page = pageRef.current;
      const requestParams: any = {
        page,
        size: 10,
        sort: sortMapping[sort],
      };

      if (selectedCategory !== '전체') {
        requestParams.category = categoryMapping[selectedCategory];
      }

      if (!params) {
        if (searchTerm) {
          if (isLocation && coordinates) {
            requestParams.latitude = coordinates.latitude;
            requestParams.longitude = coordinates.longitude;
          } else {
            requestParams.keyword = searchTerm;
            if (gpsLocation) {
              console.log(
                '[DEBUG] searchTerm 기반 fallback → gpsLocation 사용:',
                gpsLocation,
              );
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
          console.log('[DEBUG] 기본 위치로 gpsLocation 사용:', gpsLocation);
          requestParams.latitude = gpsLocation.latitude;
          requestParams.longitude = gpsLocation.longitude;
        } else {
          requestParams.latitude = null;
          requestParams.longitude = null;
        }
      } else {
        Object.assign(requestParams, params);
      }

      try {
        const res = await axiosInstance.get('/api/v1/store/list', {
          params: requestParams,
        });
        const newStores = res.data.results?.content || [];
        const isLastPage =
          res.data.results?.totalPage <= res.data.results?.currentPage + 1;

        console.log('[찾기페이지 fetchStores] 응답 정보:', {
          currentPage: res.data.results?.currentPage,
          totalPage: res.data.results?.totalPage,
          isLastPage,
          hasNextPage: !isLastPage,
          storesCount: newStores.length,
          totalStores: res.data.results?.totalElements,
        });

        setStores((prev: Store[]) => {
          const merged: Store[] =
            page === 0 ? newStores : [...prev, ...newStores];
          return Array.from(
            new Map(merged.map((store: Store) => [store.id, store])).values(),
          );
        });

        hasNextPageRef.current = !isLastPage;
        console.log(
          '[찾기페이지 fetchStores] hasNextPageRef 설정:',
          hasNextPageRef.current,
        );
      } catch (err) {
        console.error('가게 목록 불러오기 실패:', err);
        if (page === 0) setStores([]);
        hasNextPageRef.current = false;
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [selectedCategory, sort, isLocation, coordinates, searchTerm, gpsLocation],
  );

  // useInfiniteScroll 훅 사용
  const { loaderRef } = useInfiniteScroll({
    onIntersect: () => {
      if (isLocationReady) {
        pageRef.current += 1;
        console.log(
          '[찾기페이지 useInfiniteScroll] 다음 페이지 로드:',
          pageRef.current,
        );
        fetchStores();
      }
    },
    isLoadingRef,
    hasNextPageRef,
    root: null,
    threshold: 0.1,
  });

  const handleGpsClick = useGpsFetch((lat, lng) => {
    pageRef.current = 0;
    hasNextPageRef.current = true;
    setStores([]);
    fetchStores({ latitude: lat, longitude: lng });
  }, requestGps);

  // GPS 위치가 준비된 후 fetchStores 강제 호출
  useEffect(() => {
    console.log('[StoreSearchPage GPS 위치 준비 useEffect] 실행됨:', {
      gpsLocation,
      isGpsActive: !!gpsLocation,
      isLocationReady,
      storesLength: stores.length,
    });

    // GPS 위치가 준비된 후에만 데이터 로드
    if (isLocationReady) {
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
      } else {
        // GPS 위치가 없으면 기본 위치로 API 호출 (백엔드가 기본값 처리)
        console.log('[GPS 위치 준비] 기본 위치로 fetchStores 호출');
        pageRef.current = 0;
        hasNextPageRef.current = true;
        setStores([]);
        fetchStores();
      }
    }
  }, [isLocationReady, gpsLocation]);

  // 카테고리나 정렬 변경 시에만 API 요청
  useEffect(() => {
    if (isLocationReady) {
      // GPS 위치가 준비된 후에만 실행
      pageRef.current = 0;
      hasNextPageRef.current = true;
      setStores([]);
      fetchStores();
    }
  }, [
    selectedCategory,
    sort,
    isLocation,
    coordinates,
    fetchStores,
    isLocationReady,
  ]);

  const handleSearchClick = async () => {
    await handleSearch(inputValue, gpsLocation, true);
  };

  return (
    <div>
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
        <div className="flex items-center justify-center h-[calc(100vh-240px)]">
          {searchTerm && !isLocation ? (
            <NoSearchResults type="search" query={searchTerm} />
          ) : (
            <NoSearchResults type="nearby" />
          )}
        </div>
      ) : (
        <div className="pt-[20px] px-[16px]">
          <div className="flex justify-end pb-[20px]">
            <Dropdown  options={['가까운 순', '리뷰 많은 순', '별점 높은 순', '조회수 순']} onSelect={setSort} />
          </div>
          <div
            className="h-[calc(100vh-310px)] overflow-y-auto scrollbar-hide"
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

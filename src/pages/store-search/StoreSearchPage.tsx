import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';
import Header from '@/components/Header';
import SearchInput from '@/components/common/SearchInput';
import MenuCategoryCarousel from '@/components/StoreSearch/MenuCategoryCarousel';
import Dropdown from '@/components/common/Dropdown';
import StoreList from '@/components/StoreSearch/StoreList';
import { Store } from '@/types/store';
import Icons from '@/assets/icons';
import NoSearchResults from '@/components/common/NoSearchResults';
import { useLocation } from 'react-router-dom';
import useStoreSearch from '@/hooks/useStoreSearch';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { categoryMapping, sortMapping } from '@/constants/storeMapping';
import { useGps } from '@/contexts/GpsContext';
import { useGpsFetch } from '@/hooks/useGpsFetch';

interface FetchParams {
  latitude?: number;
  longitude?: number;
  keyword?: string;
  radius?: number;
  [key: string]: any;
}

const StoreSearchPage = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(
    () => location.state?.selectedCategory || '전체',
  );
  const [stores, setStores] = useState<Store[]>([]);
  const [sort, setsort] = useState('가까운 순');
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

  const { address: gpsAddress, location: gpsLocation, requestGps } = useGps();

  const fetchStores = useCallback(
    async (params?: FetchParams) => {
      const page = pageRef.current;
      const currentSearchTerm = searchTerm;
      if (isLoadingRef.current) {
        return;
      }

      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        const categoryParam =
          selectedCategory !== '전체'
            ? categoryMapping[selectedCategory]
            : undefined;
        const sortParam = sortMapping[sort];

        const requestParams: FetchParams = {
          page: page,
          size: 10,
          sort: sortParam,
          ...params,
        };

        if (categoryParam) {
          requestParams.category = categoryParam;
        }

        if (!params) {
          if (currentSearchTerm) {
            if (isLocation && coordinates) {
              requestParams.latitude = coordinates.latitude;
              requestParams.longitude = coordinates.longitude;
            } else {
              requestParams.keyword = currentSearchTerm;
              if (gpsLocation) {
                requestParams.latitude = gpsLocation.latitude;
                requestParams.longitude = gpsLocation.longitude;
              } else {
                requestParams.latitude = 37.495472;
                requestParams.longitude = 126.676902;
              }
            }
          } else {
            if (isLocation && coordinates) {
              requestParams.latitude = coordinates.latitude;
              requestParams.longitude = coordinates.longitude;
            } else if (gpsLocation) {
              requestParams.latitude = gpsLocation.latitude;
              requestParams.longitude = gpsLocation.longitude;
            }
          }
        }

        console.log('[fetchStores] 최종 params:', requestParams);

        const response = await axiosInstance.get('/api/v1/store/list', {
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

        setStores((prev) => {
          const combinedStores =
            page === 0 ? newStores : [...prev, ...newStores];
          const uniqueStores = combinedStores.reduce(
            (acc: Store[], current: Store) => {
              if (!acc.find((store) => store.id === current.id)) {
                acc.push(current);
              }
              return acc;
            },
            [] as Store[],
          );
          return uniqueStores;
        });

        hasNextPageRef.current = !isLastPage;
        pageRef.current = page;
      } catch (error) {
        console.error(
          'fetchStores: 가게 목록을 불러오는데 실패했습니다:',
          error,
        );
        if (page === 0) setStores([]);
        hasNextPageRef.current = false;
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [selectedCategory, sort, isLocation, coordinates, searchTerm],
  );

  const { loaderRef } = useInfiniteScroll({
    onIntersect: useCallback(() => {
      if (!isLoadingRef.current && hasNextPageRef.current) {
        pageRef.current += 1;
        fetchStores();
      }
    }, [fetchStores, isLoadingRef, hasNextPageRef]),
    isLoadingRef,
    hasNextPageRef,
    root: scrollContainerRef.current,
  });

  const handleGpsClick = useGpsFetch((lat, lng) => {
    pageRef.current = 0;
    hasNextPageRef.current = true;
    setStores([]);
    fetchStores({ latitude: lat, longitude: lng });
  }, requestGps);

  useEffect(() => {
    pageRef.current = 0;
    hasNextPageRef.current = true;
    setStores([]);
    fetchStores();
  }, [selectedCategory, sort, isLocation, coordinates, fetchStores]);

  const handleSearchClick = async () => {
    await handleSearch(inputValue, gpsLocation, true);
  };

  return (
    <div>
      <div className="flex flex-col items-center w-full pt-[11px] shadow-bottom shrink-0">
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
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
          }}
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
        <>
          <div className="pt-[20px] px-[16px]">
            <div className="flex justify-end pb-[20px]">
              <Dropdown onSelect={setsort} />
            </div>
            <div
              className="h-[calc(100vh-310px)] overflow-y-auto scrollbar-hide"
              ref={scrollContainerRef}
            >
              <StoreList stores={stores} />
              <div ref={loaderRef} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StoreSearchPage;

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
  const { address: gpsAddress, location: gpsLocation, requestGps } = useGps();
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
          }
        } else if (isLocation && coordinates) {
          requestParams.latitude = coordinates.latitude;
          requestParams.longitude = coordinates.longitude;
        } else if (gpsLocation) {
          requestParams.latitude = gpsLocation.latitude;
          requestParams.longitude = gpsLocation.longitude;
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

        setStores((prev: Store[]) => {
          const merged: Store[] =
            page === 0 ? newStores : [...prev, ...newStores];
          return Array.from(
            new Map(merged.map((store: Store) => [store.id, store])).values(),
          );
        });

        hasNextPageRef.current = !isLastPage;
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

  const { loaderRef } = useInfiniteScroll({
    onIntersect: useCallback(() => {
      if (!isLoadingRef.current && hasNextPageRef.current) {
        pageRef.current += 1;
        fetchStores();
      }
    }, [fetchStores]),
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
            <Dropdown onSelect={setSort} />
          </div>
          <div
            className="h-[calc(100vh-310px)] overflow-y-auto scrollbar-hide"
            ref={scrollContainerRef}
          >
            <StoreList stores={stores} />
            <div ref={loaderRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreSearchPage;

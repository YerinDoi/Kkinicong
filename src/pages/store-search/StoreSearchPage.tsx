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

const sortMapping: { [key: string]: string } = {
  '조회수 순': 'VIEW_COUNT',
  '가까운 순': 'DISTANCE',
  '리뷰 많은 순': 'REVIEW_COUNT',
  '별점 높은 순': 'RATING',
};

const StoreSearchPage = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(
    () => location.state?.selectedCategory || '전체',
  );
  const [stores, setStores] = useState<Store[]>([]);
  const [sort, setsort] = useState('조회수 순');
  const [isLoading, setIsLoading] = useState(false);

  const pageRef = useRef(0);
  const hasNextPageRef = useRef(true);
  const isLoadingRef = useRef(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    inputValue,
    setInputValue,
    searchTerm,
    isLocation,
    coordinates,
    handleSearch,
  } = useStoreSearch();

  const fetchStores = useCallback(
    async (page: number, currentSearchTerm: string) => {
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

        const params: Record<string, any> = {
          page: page,
          size: 10,
          sort: sortParam,
        };

        if (categoryParam) {
          params.category = categoryParam;
        }

        if (currentSearchTerm) {
          if (isLocation && coordinates) {
            params.latitude = coordinates.latitude;
            params.longitude = coordinates.longitude;
          } else {
            params.keyword = currentSearchTerm;
          }
        } else {
          if (isLocation && coordinates) {
            const defaultRadius = 5000;
            params.latitude = coordinates.latitude;
            params.longitude = coordinates.longitude;
          }
        }

        const response = await axiosInstance.get('/api/v1/store/list', {
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
    [selectedCategory, sort, isLocation, coordinates],
  );

  const { loaderRef } = useInfiniteScroll({
    onIntersect: useCallback(() => {
      if (!isLoadingRef.current && hasNextPageRef.current) {
        console.log('onIntersect 조건 충족, fetchStores 호출 예정', {
          nextPage: pageRef.current + 1,
        });
        fetchStores(pageRef.current + 1, searchTerm);
      }
    }, [fetchStores, isLoadingRef, hasNextPageRef, pageRef, searchTerm]),
    isLoadingRef: isLoadingRef,
    hasNextPageRef: hasNextPageRef,
    root: scrollContainerRef.current,
  });

  useEffect(() => {
    pageRef.current = 0;
    hasNextPageRef.current = true;
    setStores([]);
    fetchStores(0, searchTerm);
  }, [
    selectedCategory,
    sort,
    searchTerm,
    isLocation,
    coordinates,
    fetchStores,
  ]);

  return (
    <div>
      <div className="flex flex-col items-center w-full mt-[11px] shadow-custom shrink-0">
        <Header title="가맹점 찾기" />

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
        <MenuCategoryCarousel
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
          }}
        />
      </div>

      {!isLoading && stores.length === 0 && searchTerm && !isLocation ? (
        <div className="flex items-center justify-center h-[calc(100vh-240px)]">
          <NoSearchResults query={searchTerm} />
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

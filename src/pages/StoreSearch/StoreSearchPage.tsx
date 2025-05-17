import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';
import Header from '@/components/Header';
import SearchInput from '@/components/common/SearchInput';
import MenuCategoryCarousel from '@/components/StoreSearch/MenuCategoryCarousel';
import Dropdown from '@/components/common/Dropdown';
import StoreList from '@/components/StoreSearch/StoreList';
import { Store } from '@/types/store';
import Icons from '@/assets/icons';

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
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [sort, setsort] = useState('조회수 순');
  const [isLoading, setIsLoading] = useState(false);

  const pageRef = useRef(0);
  const hasNextPageRef = useRef(true);
  const isLoadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchStores = useCallback(async () => {
    if (isLoadingRef.current || !hasNextPageRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const categoryParam =
        selectedCategory !== '전체'
          ? categoryMapping[selectedCategory]
          : undefined;
      const sortParam = sortMapping[sort];

      const params: Record<string, any> = {
        page: pageRef.current,
        sort: sortParam,
      };

      if (categoryParam) {
        params.category = categoryParam;
      }

      if (searchTerm) {
        params.keyword = searchTerm;
      }

      const response = await axiosInstance.get(
        'https://kkinikong.store/api/v1/store/list',
        {
          params,
        },
      );

      const newStores = response.data.results.content;
      const isLastPage =
        response.data.results.totalPage ===
        response.data.results.currentPage + 1;

      setStores((prev) => {
        const combinedStores = [...prev, ...newStores];
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
      pageRef.current += 1;
      console.log('📦 호출된 페이지:', pageRef.current - 1);
    } catch (error) {
      console.error('가게 목록을 불러오는데 실패했습니다:', error);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [selectedCategory, sort, searchTerm]);

  useEffect(() => {
    setStores([]);
    pageRef.current = 0;
    hasNextPageRef.current = true;
    fetchStores();
  }, [selectedCategory, sort, fetchStores]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          fetchStores();
        }
      },
      { threshold: 0.2, root: scrollContainerRef.current },
    );

    observer.observe(loaderRef.current);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [fetchStores]);

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center w-full mt-[11px] shadow-custom shrink-0">
        <Header title="가맹점 찾기" location="인천 서구" />

        <div className="flex gap-[8px] px-[20px] w-full">
          <button>
            <Icons name="gps" />
          </button>
          <SearchInput
            placeholder="가게이름을 검색하세요"
            value={inputValue}
            onChange={setInputValue}
            onSearch={() => {
              setSearchTerm(inputValue);
              setStores([]);
              pageRef.current = 0;
              hasNextPageRef.current = true;
              fetchStores();
            }}
          />
        </div>
        <MenuCategoryCarousel
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
          }}
        />
      </div>

      <div className="pt-[20px] px-[16px]">
        <div className="flex justify-end pb-[20px]">
          <Dropdown onSelect={setsort} />
        </div>
        <div
          className="h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide"
          ref={scrollContainerRef}
        >
          {!isLoading && stores.length === 0 && searchTerm ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <StoreList stores={stores} />
          )}
          <div ref={loaderRef} />
        </div>
      </div>
    </div>
  );
};

export default StoreSearchPage;

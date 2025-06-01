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
  const [selectedCategory, setSelectedCategory] = useState(() =>
  location.state?.selectedCategory || '전체'
);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [sort, setsort] = useState('조회수 순');
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

    // 검색 결과 초기화
    setStores([]);
    pageRef.current = 0;
    hasNextPageRef.current = true;

    // 위경도 변환이 완료된 후 검색 실행
    if (isLocation && locationCoordinates) {
      // 지역 검색인 경우 위경도 정보 사용
      const params: Record<string, any> = {
        page: 0,
        sort: sortMapping[sort],
        latitude: locationCoordinates.latitude,
        longitude: locationCoordinates.longitude,
      };

      if (selectedCategory !== '전체') {
        params.category = categoryMapping[selectedCategory];
      }

      console.log('지역 기반 검색:', {
        location: searchInput,
        latitude: locationCoordinates.latitude,
        longitude: locationCoordinates.longitude,
      });

      const response = await axiosInstance.get('/api/v1/store/list', {
        params,
      });

      console.log('API 응답:', response.data);

      const newStores = response.data.results.content;
      setStores(newStores);
    } else {
      // 일반 키워드 검색
      fetchStores(searchInput);
    }
  };

  const fetchStores = useCallback(
    async (currentSearchTerm: string) => {
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

        if (currentSearchTerm) {
          if (isLocation) {
            params.latitude = coordinates.latitude;
            params.longitude = coordinates.longitude;
            console.log('지역 기반 검색:', {
              location: currentSearchTerm,
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            });
          } else {
            params.keyword = currentSearchTerm;
            console.log('키워드 기반 검색:', currentSearchTerm);
          }
        }

        console.log('API 요청 파라미터:', params);

        const response = await axiosInstance.get('/api/v1/store/list', {
          params,
        });

        console.log('API 응답:', response.data);

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
      } catch (error) {
        console.error('가게 목록을 불러오는데 실패했습니다:', error);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [selectedCategory, sort, isLocation, coordinates],
  );

  // 카테고리나 정렬 변경 시에만 검색 실행
  useEffect(() => {
    setStores([]);
    pageRef.current = 0;
    hasNextPageRef.current = true;
    fetchStores(searchTerm);
  }, [selectedCategory, sort, fetchStores, searchTerm]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          fetchStores(searchTerm);
        }
      },
      { threshold: 0.2, root: scrollContainerRef.current },
    );

    observer.observe(loaderRef.current);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [fetchStores, searchTerm]);

  return (
    <div>
      <div className="flex flex-col items-center w-full mt-[11px] shadow-custom shrink-0">
        <Header title="가맹점 찾기" />

        <div className="flex gap-[8px] px-[20px] w-full">
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

      {/* 캐러셀 아래 영역 전체 */}
      {/* 로딩 중이 아니고, 검색 결과가 없으며, 검색어가 있을 경우 NoSearchResults 표시 */}
      {!isLoading && stores.length === 0 && searchTerm ? (
        <div className="flex items-center justify-center h-[calc(100vh-240px)]">
          <NoSearchResults query={searchTerm} />
        </div>
      ) : (
        <>
          {/* 검색 결과가 있거나 로딩 중, 또는 검색어가 없는 경우 목록 표시 */}
          <div className="pt-[20px] px-[16px]">
            {/* 정렬 드롭다운 */}
            <div className="flex justify-end pb-[20px]">
              <Dropdown onSelect={setsort} />
            </div>
            {/* 가게 목록 */}
            <div
              className="h-[calc(100vh-310px)] overflow-y-auto scrollbar-hide"
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
  );
};

export default StoreSearchPage;

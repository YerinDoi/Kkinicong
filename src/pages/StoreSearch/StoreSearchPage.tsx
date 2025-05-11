import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import SearchInput from '@/components/common/SearchInput';
import MenuCategoryCarousel from '@/components/StoreSearch/MenuCategoryCarousel';
import Dropdown from '@/components/common/Dropdown';
import StoreList from '@/components/StoreSearch/StoreList';
//import { mockStores } from '@/mocks/stores';
import { Store } from '@/types/store';

const StoreSearchPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [page, setPage] = useState(0); // 초기 페이지
  const [hasNextPage, setHasNextPage] = useState(true); // 다음 페이지 존재 여부
  const [isLoading, setIsLoading] = useState(false); // 로딩 중 여부

  const observerRef = useRef(null);
  const hasMounted = useRef(false);

  const fetchStores = async () => {
    if (isLoading || !hasNextPage) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        'http://ec2-13-209-219-105.ap-northeast-2.compute.amazonaws.com/api/v1/store/list',
        {
          params: {
            page,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            // 여기에 추가적인 필터링이나 정렬 넣기 가능 (ex: latitude, longitude 등)
          }
        }
      );

      const newStores = response.data.results.content;
      const isLastPage = response.data.results.totalPage === response.data.results.currentPage + 1;

      setStores((prev) => [...prev, ...newStores]);
      setHasNextPage(!isLastPage);
      setPage((prev) => prev + 1); // 페이지 증가

      console.log('응답 데이터:', response.data); // 응답 데이터 로그

    } catch (error) {
      console.error('가게 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
};


  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!hasMounted.current) return; // 첫 마운트 시 무시

        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          fetchStores();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, isLoading]);

  // 페이지 첫 로딩 시
  useEffect(() => {
    fetchStores().then(() => {
      hasMounted.current = true;
    });
  }, []);

  const filteredStores = stores.filter((store) => {
    const matchesCategory =
      selectedCategory === 'all' || store.category === selectedCategory;
  
    //const cleanSearch = searchTerm.replace(/\s+/g, '').toLowerCase();
    //const storeName = store.name.replace(/\s+/g, '').toLowerCase();
    //const storeAddress = store.address.replace(/\s+/g, '').toLowerCase();
    //const categoryName = store.category.replace(/\s+/g, '').toLowerCase();
  
    /*const matchesSearch =
      cleanSearch === '' || 
      storeName.includes(cleanSearch) ||
      storeAddress.includes(cleanSearch) ||
      categoryName.includes(cleanSearch);
  
    return matchesCategory && matchesSearch;*/
    return matchesCategory;
  });

  return (
    <div>
      <div className="flex flex-col items-center w-full mt-[11px] shadow-custom">
        <Header title="가맹점 찾기" location="인천 서구" />
        <SearchInput placeholder="가게이름을 검색하세요" value={inputValue} onChange={setInputValue} onSearch={() => setSearchTerm(inputValue)} />
        <MenuCategoryCarousel
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div className="pt-[20px] px-[16px] pb-[29px]">
        <div className="flex justify-end">
          <Dropdown />
        </div>
        <StoreList stores={filteredStores} />

        {hasNextPage && stores.length > 0 && (
          <div ref={observerRef} style={{ height: 1, background: 'red' }} />
        )}

      </div>
    </div>
  );
};

export default StoreSearchPage;
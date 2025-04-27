import React from 'react';
import Header from '@/components/StoreSearch/Header';
import SearchInput from '@/components/common/SearchInput';
import MenuCategoryCarousel from '@/components/StoreSearch/MenuCategoryCarousel';
import Dropdown from '@/components/common/Dropdown';

const StoreSearchPage = () => {
  return (
  <div>
    <div className="flex flex-col items-center w-full mt-[11px] shadow-custom">
      <Header title="가맹점 찾기" location="인천 서구" />
      <SearchInput placeholder="가게이름을 검색하세요" />
      <MenuCategoryCarousel />
    </div>

    <div className="pt-[20px] px-[16px]">
      <div className="flex justify-end">
        <Dropdown />
      </div>
    </div>
  </div>
  );
};

export default StoreSearchPage;

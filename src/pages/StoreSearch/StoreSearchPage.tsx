import React, { useState } from 'react';
import Header from '@/components/Header';
import SearchInput from '@/components/common/SearchInput';
import MenuCategoryCarousel from '@/components/StoreSearch/MenuCategoryCarousel';
import Dropdown from '@/components/common/Dropdown';
import StoreList from '@/components/StoreSearch/StoreList';
import { mockStores } from '@/mocks/stores';

const StoreSearchPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStores = mockStores.filter((store) => {
    const matchesCategory =
      selectedCategory === 'all' || store.category.id === selectedCategory;
  
    const cleanSearch = searchTerm.replace(/\s+/g, '').toLowerCase();
    const storeName = store.name.replace(/\s+/g, '').toLowerCase();
    const storeAddress = store.address.replace(/\s+/g, '').toLowerCase();
    const categoryName = store.category.name.replace(/\s+/g, '').toLowerCase();
  
    const matchesSearch =
      cleanSearch === '' || 
      storeName.includes(cleanSearch) ||
      storeAddress.includes(cleanSearch) ||
      categoryName.includes(cleanSearch);
  
    return matchesCategory && matchesSearch;
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
      </div>
    </div>
  );
};

export default StoreSearchPage;

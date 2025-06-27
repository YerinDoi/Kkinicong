import { useEffect, useState } from 'react';
import { fetchConvenienceProducts } from '@/api/convenience';
import { useCallback } from 'react';

import SearchInput from '@/components/common/SearchInput';
import TopBar from '@/components/common/TopBar';
import InfoShareCard from '@/components/ConvenienceStore/InfoShareCard';

import ProductListSection from '../../components/ConvenienceStore/ProductListSection';
import ButtonGroup from '../../components/ConvenienceStore/ButtonGroup';
import Check from '../../components/ConvenienceStore/Check';
import CategoryFilterSelector from '../../components/ConvenienceStore/CategoryFilterSelector';

const ConvenienceStorePage = () => {
  const [products, setProducts] = useState([]); // 편의점 제품 목록 상태
  const [selectedCategory, setSelectedCategory] = useState('전체'); // 상품 카테고리 선택
  const [selectedBrand, setBrand] = useState(''); //  편의점 브랜드 선택
  const [onlyAvailable, setOnlyAvailable] = useState(false); // 결제 가능 제품만 보기 여부
  const [keyword, setKeyword] = useState(''); // 검색 키워드 상태

  // pagination 기본값
  const page = 0;
  const size = 10;

  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchConvenienceProducts({
        keyword,
        category: selectedCategory === '전체' ? undefined : selectedCategory,
        brand: selectedBrand,
        isAvailableCheck: onlyAvailable,
        page,
        size,
      });
      setProducts(data);
    } catch (err) {
      console.error('상품 조회 실패:', err);
    }
  }, [keyword, selectedCategory, selectedBrand, onlyAvailable, page, size]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="flex flex-col h-full bg-[#FFF5DF]">
      {/* 상단 : 탑바, 검색바, 정보 카드*/}
      <TopBar title="편의점 구매정보" />
      <div className="px-4">
        <SearchInput
          placeholder="CU, 불닭볶음면 ..."
          value={keyword}
          onChange={setKeyword}
          onSearch={loadProducts}
        />
      </div>
      <InfoShareCard />

      {/* 하단 : 필터링바, 제품 리스트 */}
      <div className="flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between gap-2 px-4 py-3 overflow-x-auto">
          <CategoryFilterSelector
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
          <ButtonGroup
            options={['GS25', 'CU', '세븐일레븐', '이마트24', '미니스톱']}
            selected={selectedBrand}
            onChange={(value) => setBrand(value)}
          />
        </div>

        <Check
          checked={onlyAvailable}
          onChange={setOnlyAvailable}
          label="결제 가능만 모아보기"
          className="px-4 py-2"
        />
        <ProductListSection products={products} keyword={keyword} />
      </div>
    </div>
  );
};

export default ConvenienceStorePage;

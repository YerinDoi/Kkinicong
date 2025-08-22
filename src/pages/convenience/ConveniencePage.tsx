import { useEffect, useState } from 'react';
import { fetchConvenienceProducts } from '@/api/convenience';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import SearchInput from '@/components/common/SearchInput';
import Header from '@/components/Header';
import InfoShareCard from '@/components/convenience/InfoShareCard';
// import StoreChipCarousel from '@/components/home/ChipCarousel';
import ProductListSection from '../../components/convenience/ProductListSection';
//import ButtonGroup from '../../components/convenience/ButtonGroup';
import Check from '../../components/convenience/Check';
import CategoryFilterSelector from '../../components/convenience/CategoryFilterSelector';
import ButtonGroup from '@/components/convenience/ButtonGroup';

const ConvenienceStorePage = () => {
  const location = useLocation();
  const initialBrand = location.state?.brand || 'GS25';
  const [products, setProducts] = useState([]); // 편의점 제품 목록 상태
  const [selectedCategory, setSelectedCategory] = useState('전체'); // 상품 카테고리 선택
  const [selectedBrand, setBrand] = useState(initialBrand); //  편의점 브랜드 선택
  const [onlyAvailable, setOnlyAvailable] = useState(false); // 결제 가능 제품만 보기 여부
  const [keyword, setKeyword] = useState(''); // 검색 키워드 상태

  const brands = ['GS25', 'CU', '세븐일레븐', '이마트24', '미니스톱'];
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // pagination 기본값
  const page = 0;
  const size = 10;

  const goPrev = () => {
    if (idx === 0) return;
    setDirection(-1);
    setIdx((i) => i - 1);
    setBrand(brands[idx - 1]);
  };
  const goNext = () => {
    if (idx === brands.length - 1) return;
    setDirection(1);
    setIdx((i) => i + 1);
    setBrand(brands[idx + 1]);
  };
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

      <Header title="편의점 구매정보" />
      <div className="px-[27.5px]">
        <SearchInput
          placeholder="CU, 불닭볶음면 ..."
          value={keyword}
          onChange={setKeyword}
          onSearch={loadProducts}
        />
      </div>
      <div className="flex justify-center">
        <InfoShareCard />
      </div>

      {/* 하단 : 필터링바, 제품 리스트 */}
      <div className="flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between gap-2 px-[20px] py-[12px] overflow-x-auto scrollbar-hide">
          <CategoryFilterSelector
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
          {/* <StoreChipCarousel selected={selectedBrand} onSelect={setBrand} /> */}
          <ButtonGroup
            options={brands}
            selected={selectedBrand}
            onChange={setBrand}
          />
        </div>

        <Check
          checked={onlyAvailable}
          onChange={setOnlyAvailable}
          label="결제 가능만 모아보기"
          className="px-[20px] pt-[8px]"
        />
        <ProductListSection
          products={products}
          keyword={keyword}
          listKey={brands[idx]} // 바뀔 때만 텍스트 교체 발생
          direction={direction}
          onSwipePrev={goPrev}
          onSwipeNext={goNext}
        />
      </div>
    </div>
  );
};

export default ConvenienceStorePage;

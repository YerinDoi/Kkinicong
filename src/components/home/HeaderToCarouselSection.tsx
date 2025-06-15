import HomeTopBar from '@/components/home/HomeTopBar';
import Icons from '@/assets/icons';
import SearchInput from '@/components/common/SearchInput';
import { useState } from 'react';
import CarouselBanner from '@/components/home/CarouselBanner';
import { useGps } from '@/contexts/GpsContext';
const bgColors = ['#F3F5ED', '#F4F6F8'];

function HeaderToCarouselSection() {
  const [inputValue, setInputValue] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  const { address, requestGps } = useGps();

  // handleSearch 임시 함수 (에러 방지)
  const handleSearch = () => {};

  return (
    <div
      className="transition-colors duration-500 py-[8px] flex flex-col "
      style={{ backgroundColor: bgColors[activeSlide] }}
    >
      <div className="px-[15px]">
        <HomeTopBar address={address} />
      </div>
      {/*GPS 구현 (자주 가는 지역 제외), 검색 부분은 수정 예정. 지금은 ui만 구현*/}
      <div className="flex gap-[8px] px-[20px] w-full">
        <button onClick={() => requestGps()}>
          <Icons name="gps" />
        </button>

        <SearchInput
          placeholder="가게이름을 검색하세요"
          value={inputValue}
          onChange={setInputValue}
          onSearch={() => handleSearch()} // 오류 떠서 인수 수정
        />
      </div>

      <CarouselBanner onSlideChange={setActiveSlide} />
    </div>
  );
}

export default HeaderToCarouselSection;

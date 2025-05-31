import HomeTopBar from '@/components/home/HomeTopBar';
import Icons from '@/assets/icons';
import SearchInput from '@/components/common/SearchInput';
import { useState } from 'react';
import CarouselBanner from '@/components/home/CarouselBanner';
const bgColors = ['#F3F5ED', '#F4F6F8'];

function HeaderToCarouselSection() {
  const [inputValue,setInputValue] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  
  return (
    <div className="transition-colors duration-500 py-[8px] flex flex-col "
    style={{ backgroundColor: bgColors[activeSlide] }}>
      <div className='px-[15px]'>
        <HomeTopBar />
      </div>
      {/*추후 GPS, 검색 부분은 수정 예정. 지금은 ui만 구현*/}
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
        <CarouselBanner onSlideChange={setActiveSlide} />
    </div>
  );
}

export default HeaderToCarouselSection;

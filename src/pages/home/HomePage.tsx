import HomeTopBar from '@/components/home/HomeTopBar';
import Icons from '@/assets/icons';
import SearchInput from '@/components/common/SearchInput';
import { useState } from 'react';
function HomePage() {
  const [inputValue, setInputValue] = useState('');

  
  return (
    <div className="bg-[#F3F5ED] min-h-screen py-[8px] flex flex-col ">
      <div className='px-[15px]'>
        <HomeTopBar />
      </div>
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
     
    </div>
  );
}

export default HomePage;

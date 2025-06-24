import HomeTopBar from '@/components/home/HomeTopBar';
import Icons from '@/assets/icons';
import SearchInput from '@/components/common/SearchInput';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselBanner from '@/components/home/CarouselBanner';
import { useGps } from '@/contexts/GpsContext';
import axiosInstance from '@/api/axiosInstance';
import { Store } from '@/types/store';

const bgColors = ['#F3F5ED', '#F4F6F8'];

function HeaderToCarouselSection() {
  const [inputValue, setInputValue] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  const { address, requestGps, location: gpsLocation } = useGps();

  const handleSearch = async () => {
    const searchTerm = inputValue.trim();
    if (!searchTerm) return;

    try {
      // 검색 시 위치 정보를 포함하도록 파라미터 구성
      const params: any = { keyword: searchTerm, size: 2 };
      if (gpsLocation && gpsLocation.latitude && gpsLocation.longitude) {
        params.latitude = gpsLocation.latitude;
        params.longitude = gpsLocation.longitude;
        params.radius = 20000; // GPS 위치 기반 20km 반경
      }

      const response = await axiosInstance.get('/api/v1/store/map', {
        params,
      });

      const stores: Store[] = response.data.results?.content || [];

      // 결과가 정확히 1개이고, 이름이 검색어와 정확히 일치하면 상세 페이지로 이동
      if (
        stores.length === 1 &&
        stores[0].name.toLowerCase() === searchTerm.toLowerCase()
      ) {
        navigate(`/store/${stores[0].id}`);
      } else {
        // 지역명(동/구/역)으로 끝나면 center 없이 검색어만 넘김
        const isAddress = /동$|구$|역$/.test(searchTerm);
        if (isAddress) {
          navigate('/store-map', { state: { searchTerm } });
        } else {
          // 일반 키워드는 center도 같이 넘김
          navigate('/store-map', {
            state: {
              searchTerm,
              center: gpsLocation
                ? { lat: gpsLocation.latitude, lng: gpsLocation.longitude }
                : null,
            },
          });
        }
      }
    } catch (error) {
      console.error('Search failed, navigating to map page as fallback', error);
      // 에러 발생 시에도 안전하게 지도 페이지로 이동
      const isAddress = /동$|구$|역$/.test(searchTerm);
      if (isAddress) {
        navigate('/store-map', { state: { searchTerm } });
      } else {
        navigate('/store-map', {
          state: {
            searchTerm,
            center: gpsLocation
              ? { lat: gpsLocation.latitude, lng: gpsLocation.longitude }
              : null,
          },
        });
      }
    }
  };

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
          onSearch={handleSearch}
        />
      </div>

      <CarouselBanner onSlideChange={setActiveSlide} />
    </div>
  );
}

export default HeaderToCarouselSection;

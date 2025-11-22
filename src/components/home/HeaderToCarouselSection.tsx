import HomeTopBar from '@/components/home/HomeTopBar';
import Icons from '@/assets/icons';
import SearchInput from '@/components/common/SearchInput';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselBanner from '@/components/home/CarouselBanner';
import { useGps } from '@/contexts/GpsContext';
import axiosInstance from '@/api/axiosInstance';
import { Store } from '@/types/store';
import { trackSearchStore } from '@/analytics/ga';

const bgColors = ['#F3F5ED', '#F4F6F8', '#F3F5ED'];

function HeaderToCarouselSection() {
  const [inputValue, setInputValue] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const swiperRef = useRef<any>(null); // Swiper에 대한 ref

  const { address, requestGps, location: gpsLocation } = useGps();

  const handleSearch = async () => {
    const searchTerm = inputValue.trim();
    if (!searchTerm) return;

    try {
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
      const uniqueStores = stores.filter(
        (store, index, self) =>
          index === self.findIndex((s) => s.id === store.id),
      );

      // 검색 이벤트 태깅
      trackSearchStore(searchTerm, uniqueStores.length);

      if (
        uniqueStores.length === 1 &&
        uniqueStores[0].name.toLowerCase().replace(/\s/g, '') ===
          searchTerm.toLowerCase().replace(/\s/g, '')
      ) {
        console.log('상세페이지로 이동:', uniqueStores[0].id);
        navigate(`/store/${uniqueStores[0].id}`);
      } else {
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
    } catch (error) {
      console.error('Search failed, navigating to map page as fallback', error);
      const isAddress = /동$|구$|역$/.test(inputValue);
      if (isAddress) {
        navigate('/store-map', { state: { searchTerm: inputValue } });
      } else {
        navigate('/store-map', {
          state: {
            searchTerm: inputValue,
            center: gpsLocation
              ? { lat: gpsLocation.latitude, lng: gpsLocation.longitude }
              : null,
          },
        });
      }
    }
  };

  // Swiper 초기화 지연 처리
  useEffect(() => {
    if (swiperRef.current) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => swiperRef.current?.autoplay?.start());
      } else {
        setTimeout(() => swiperRef.current?.autoplay?.start(), 800);
      }
    }
  }, []);

  return (
    <div
      className="transition-colors duration-500 py-[8px] flex flex-col"
      style={{ backgroundColor: bgColors[activeSlide] }}
    >
      <div className="px-[15px]">
        <HomeTopBar address={address} />
      </div>
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

      <CarouselBanner onSlideChange={setActiveSlide} swiperRef={swiperRef} />
    </div>
  );
}

export default HeaderToCarouselSection;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import TopStoreItem from '@/components/home/TopStoreItem';
import { Store } from '@/types/store';
import { useGps } from '@/contexts/GpsContext';

const DEFAULT_LOCATION = { latitude: 37.495472, longitude: 126.676902 }; // 인천

function Top8StoreSection() {
  const [stores, setStores] = useState<Store[]>([]);
  const { location: gpsLocation, isGpsActive } = useGps();
  const navigate = useNavigate();

  const fetchTopStores = async (lat: number, lng: number, isRetry = false) => {
    try {
      const response = await axiosInstance.get('/api/v1/store/top', {
        params: { latitude: lat, longitude: lng },
      });

      if (response.data.isSuccess) {
        const results = response.data.results;
        if (results.length === 0 && !isRetry) {
          // 주변에 아무 가맹점이 없다면 인천 좌표로 재요청
          await fetchTopStores(
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
            true,
          );
        } else {
          setStores(results);
        }
      }
    } catch (error) {
      console.error('Top 8 가맹점 조회 실패:', error);
    }
  };

  useEffect(() => {
    const lat = gpsLocation?.latitude ?? DEFAULT_LOCATION.latitude;
    const lng = gpsLocation?.longitude ?? DEFAULT_LOCATION.longitude;
    fetchTopStores(lat, lng);
  }, [gpsLocation]);

  const handleStoreClick = (store: Store) => {
    navigate(`/store/${store.id}`);
  };

  return (
    <div className="pt-[4px] px-[20px] pb-[14px] border-b-8 border-[#F4F6F8] flex flex-col gap-[16px]">
      <p className="text-black text-base font-semibold leading-[20px]">
        오늘 끼니는 여기 어때요?
      </p>
      <div
        className="flex w-full overflow-x-auto scrollbar-hide gap-[12px]"
        style={{ padding: '0 2px 10px 0' }}
      >
        {stores.map((store) => (
          <div key={store.id} onClick={() => handleStoreClick(store)}>
            <TopStoreItem store={store} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top8StoreSection;

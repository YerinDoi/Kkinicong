import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopStoreItem from '@/components/home/TopStoreItem';
import { Store } from '@/types/store';
import { useGps } from '@/contexts/GpsContext';

function Top8StoreSection() {
  const [stores, setStores] = useState<Store[]>([]);
  const { fetchStoresWithLocation, location } = useGps(); //  GpsContext 함수 사용
  const navigate = useNavigate();

  useEffect(() => {
    // GPS 위치가 있으면 해당 위치로, 없으면 null 전달 (백엔드가 디폴트값 처리)
    fetchStoresWithLocation('/api/v1/store/top', setStores, true);
  }, [fetchStoresWithLocation]);

  const handleStoreClick = (store: Store) => {
    navigate(`/store/${store.id}`);
  };

  return (
    <div className="pt-[4px] px-[20px] pb-[14px] border-b-8 border-bg-gray flex flex-col gap-[16px]">
      <p className="text-black text-title-sb-button font-semibold leading-[20px]">
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

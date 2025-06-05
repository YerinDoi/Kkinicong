import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import TopStoreItem from '@/components/home/TopStoreItem';
import { Store } from '@/types/store';

function Top8StoreSection() {
  const [stores, setStores] = useState<Store[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopStores = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/store/top', {
          params: {
            latitude: 37.545472,
            longitude: 126.676902, //gps 연동시 수정 예정정
          },
        });
        if (response.data.isSuccess) {
          setStores(response.data.results);
        }
        console.log(response.data.results);
      } catch (error) {
        console.error('Top 8 가맹점 조회 실패:', error);
      }
    };

    fetchTopStores();
  }, []); //컴포넌트가 처음 마운트될 때만 한 번 실행

  const handleStoreClick = (store: Store) => {
    navigate(`/store/${store.id}`, {});
  };

  return (
    <div className="pt-[4px] px-[20px] pb-[14px] border-b-8 border-[#F4F6F8] flex flex-col gap-[16px]">
      <p className="text-black text-base font-semibold leading-[20px]">
        오늘은 끼니는 여기 어때요?
      </p>
      <div
        className="flex w-full overflow-x-auto scrollbar-hide gap-[12px] "
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

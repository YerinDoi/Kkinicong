import KakaoMap from '@/components/common/KakaoMap';
import { mockStores } from '@/mocks/stores';
import { useParams } from 'react-router-dom';

const StoreDetailMap: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const store = mockStores.find((store) => store.id === storeId);

  if (!store) {
    return <div>가맹점 정보를 찾을 수 없습니다.</div>;
  }

  const marker = [{ lat: store.lat, lng: store.lng }];
  const center = { lat: store.lat, lng: store.lng };

  return (
    <div className="w-full h-[224px]">
      <KakaoMap center={center} markers={marker} />
    </div>
  );
};

export default StoreDetailMap;

import { useParams } from 'react-router-dom';
import { mockStores } from '@/mocks/stores';
import StoreDetailMap from '@/components/StoreDetail/StoreDetailMap';

const StoreDetailPage = () => {
    const { storeId } = useParams<{ storeId: string }>();
    const store = mockStores.find((store) => store.id === storeId);

    if (!store) {
        return <div>가맹점 정보를 찾을 수 없습니다.</div>;
    }

  return (
    <div>
        <h1>{store.name}</h1>
        <p>{store.address}</p>
        <StoreDetailMap />
    </div>
  )
};

export default StoreDetailPage;

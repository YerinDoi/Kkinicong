import { useParams, useLocation } from 'react-router-dom';
import { mockStores } from '@/mocks/stores';
import StoreDetailMap from '@/components/StoreDetail/StoreDetailMap';
import StoreDetailInfo from '@/components/StoreDetail/StoreDetailInfo';
import Header from '@/components/Header';

const StoreDetailPage = () => {
    const { storeId } = useParams<{ storeId: string }>();
    const store = mockStores.find((store) => store.id === storeId);
    const location = useLocation();
    const { isLiked, likeCount } = location.state || { isLiked: false, likeCount: 0 };
    if (!store) {
        return <div>가맹점 정보를 찾을 수 없습니다.</div>;
    }

  return (
    <div className="font-pretendard">
        <Header title="" location=""/>
        <StoreDetailInfo category={store.category.name} name={store.name} address={store.address} badgeText = {store.mainTag} favoriteCount={likeCount} isLiked={isLiked} status={store.status} open={store.businessHours.open}
  close={store.businessHours.close}
  weekly={store.businessHours.weekly}/>
        <StoreDetailMap />
    </div>
  )
};

export default StoreDetailPage;

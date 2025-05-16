import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import StoreDetailMap from '@/components/StoreDetail/StoreDetailMap';
import StoreDetailInfo from '@/components/StoreDetail/StoreDetailInfo';
import TopBar from '@/components/common/TopBar';
import StoreDetailReview from '@/components/StoreDetail/StoreDetailReview';
import { StoreDetail } from '@/types/store';

const StoreDetailPage = () => {
  const { storeId } = useParams<{ storeId: string }>();

  const location = useLocation();
  const { isLiked, likeCount } = location.state || {
    isLiked: false,
    likeCount: 0,
  };

  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStoreDetail = async () => {
      try {
        const response = await axios.get(
          `http://ec2-13-209-219-105.ap-northeast-2.compute.amazonaws.com/api/v1/store/${storeId}`,
        );
        setStore(response.data.results);
      } catch (err) {
        console.error('가맹점 정보를 불러오는데 실패했습니다.', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) fetchStoreDetail();
  }, [storeId]);

  if (loading) return <div>로딩 중...</div>;
  if (error || !store) return <div>가맹점 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="font-pretendard">
      <TopBar rightElement />
      <StoreDetailInfo
        storeId ={store.storeId}
        category={store.storeCategory}
        name={store.storeName}
        address={store.storeAddress}
        badgeText={store.representativeTag ?? undefined}
        favoriteCount={likeCount}
        isLiked={isLiked}
        weekly={store.storeWeeklyOpeningHours ?? undefined}
        updatedDate = {store.storeUpdatedDate}
      />
      <StoreDetailMap />
      {/* <StoreDetailReview store={store} /> */}
    </div>
  );
};

export default StoreDetailPage;

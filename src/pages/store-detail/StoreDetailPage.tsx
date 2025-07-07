import { useParams } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { useEffect, useState } from 'react';
import StoreDetailMap from '@/components/StoreDetail/StoreDetailMap';
import StoreDetailInfo from '@/components/StoreDetail/StoreDetailInfo';
import TopBar from '@/components/common/TopBar';
import StoreDetailReview from '@/components/StoreDetail/StoreDetailReview';
import { StoreDetail } from '@/types/store';

const StoreDetailPage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 리뷰PR 커밋용 주석 열기
  // 가맹점 상세 정보 불러오기
  const fetchStoreDetail = async () => {
    try {
      const res = await axios.get(`/api/v1/store/${storeId}`);
      const storeData = res.data.results;
      console.log('대표 태그:', storeData.representativeTag);

      setStore(storeData);
      setIsLiked(storeData.isScrapped === true);
      setLikeCount(storeData.storeScrapCount ?? 0);
    } catch (err) {
      console.error('가맹점 정보를 불러오는데 실패했습니다.', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) fetchStoreDetail();
  }, [storeId]);

  if (loading) return <div>로딩 중...</div>;
  if (error || !store) return <div>가맹점 정보를 찾을 수 없습니다.</div>;

  // 리뷰PR 커밋용 주석 닫기

  return (
    <div className="font-pretendard">
      <TopBar rightType="menu" />
      <StoreDetailInfo
        store={store}
        storeId={store.storeId}
        category={store.storeCategory}
        name={store.storeName}
        address={store.storeAddress}
        badgeText={store.representativeTag ?? undefined}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        favoriteCount={likeCount}
        setLikeCount={setLikeCount}
        weekly={store.storeWeeklyOpeningHours ?? undefined}
        updatedDate={store.storeUpdatedDate}
      />

      <StoreDetailMap store={store} />
      <StoreDetailReview store={store} onReviewChange={fetchStoreDetail} />
    </div>
  );
};

export default StoreDetailPage;

import TopBar from '@/components/common/TopBar';
import EmptyView from '@/components/Mypage/EmptyView';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMyReviews } from '@/api/mypage';
import MyReviewItem from '@/components/Mypage/MyReviewItem';

const MyReviewsPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReviews(0, 20)
      .then((res) => setReviews(res.data.results.content))
      .finally(() => setLoading(false));
  }, []);

  const refreshReviews = () => {
    setLoading(true);
    getMyReviews(0, 20)
      .then((res) => setReviews(res.data.results.content))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col w-full h-full pt-[11px]">
      <TopBar
        title="내가 쓴 리뷰"
        rightType="none"
        onBack={() => navigate('/mypage')}
      />
      {loading ? null : reviews.length === 0 ? (
        <div className="flex flex-1 w-full h-full items-center justify-center bg-[#F4F6F8]">
          <EmptyView title={'아직 작성한 리뷰가 없어요'} />
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          <div className="bg-[#F3F5ED] font-pretendard text-title-sb-button text-[#616161] px-[34px] py-[8px] font-medium mt-[8px]">
            내가 쓴 리뷰 수 {reviews.length}개
          </div>
          {/* 내가 쓴 리뷰 아이템 */}
          <div className="flex flex-col gap-[20px]">
            {reviews.map((review) => (
              <MyReviewItem
                key={review.reviewId}
                storeName={review.storeName}
                date={review.createdAt}
                rating={review.rating}
                content={review.content}
                imageUrl={review.imageUrl}
                tags={review.tags}
                storeId={review.storeId}
                reviewId={review.reviewId}
                setReviews={setReviews}
                refreshReviews={refreshReviews}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;

import ReviewItem from '@/components/StoreDetail/ReviewItem';
import { StoreDetail, StoreReview } from '@/types/store';
import AddIcon from '@/assets/svgs/common/add-icon.svg';
import Star from '@/assets/svgs/review/yellow-star.svg';
import CongG from '@/assets/svgs/logo/congG.svg';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from '@/api/axiosInstance';
import LoginModal from '@/components/common/LoginRequiredBottomSheet';

interface StoreDetailReviewProps {
  store: StoreDetail;
}

const StoreDetailReview: React.FC<StoreDetailReviewProps> = ({ store }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [ratingAvg, setRatingAvg] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleReviewClick = () => {
    const isLoggedIn = !!localStorage.getItem('accessToken');

    if (isLoggedIn) {
      navigate(`/store-review/${store.storeId}`, {
        state: {
 
          name: store.storeName,
          address: store.storeAddress,
          category: store.storeCategory,
          mainTag: store.representativeTag,
          storeId:store.storeId,
          latitude: store.latitude,           // ← 추가!
    longitude: store.longitude
        },
      });
    } else {
      setShowLoginModal(true);
    }
  };

  const fetchReviews = async (pageToLoad: number) => {
    const res = await axios.get(`/api/v1/${store.storeId}/review`, {
      params: { page: pageToLoad, size: 5 },
    });
    const { ratingAvg, reviewCount, pageResponse } = res.data.results;

    if (pageToLoad === 0) {
      setReviews(pageResponse.content);
      setRatingAvg(ratingAvg);
      setReviewCount(reviewCount);
    } else {
      setReviews((prev) => [...prev, ...pageResponse.content]);
    }

    setPage(pageToLoad);
    setTotalPage(pageResponse.totalPage);
  };

  useEffect(() => {
    fetchReviews(0);
  }, [store.storeId]);

  

  return (
    <section className="flex flex-col mt-[12px] ">
      {/* 리뷰쓰기 배너*/}
      <div className="bg-[#F3F5ED] p-[16px]">
        <div className="flex h-[112px]">
          <div className="h-full pb-[16px] text-[15px] font-semibold leading-[20px] flex flex-col gap-[4px] justify-center">
            <p className="text-[#029F64]">{store.storeName}</p>
            <p className="text-black">다녀오셨나요?</p>
            <p className="text-black">리뷰를 통해 경험을 공유해주세요!</p>
          </div>
          <img src={CongG} className="w-[122px]" />
        </div>

        <button
          onClick={handleReviewClick}
          className="w-full bg-[#65CE58] text-white rounded-[12px] px-[16px] py-[10px] justify-center flex gap-[10px] text-base font-semibold items-center"
        >
          <img src={AddIcon} className="w-[14px] h-[14px] " />
          리뷰쓰기
        </button>
      </div>

      {/* 헤더 */}
      <div className="flex justify-between px-[16px] py-[8px] my-[12px] items-center text-base font-semibold">
        <p>최근 리뷰 {reviewCount}개</p>
        <div className="flex gap-[8px] text-[#919191] leading-[20px]">
          <img src={Star} className="w-[24px]" />
          <span>{ratingAvg.toFixed(1)}</span>
        </div>
      </div>
      
      {/* 리뷰 카드 리스트 */}
      <div className="flex flex-col gap-[20px]">{
        reviewCount == 0 ? (
          <div className='flex flex-col gap-[12px] mt-[34px] mb-[61px] text-center'>
            <p className='text-sm font-medium leading-[18px]'>아직은 작성된 리뷰가 없어요</p>
            <button onClick={handleReviewClick} className='text-xs font-medium text-[#919191] underline'>첫번째 리뷰를 작성하시겠어요?</button>
          </div>
        ):(reviews.map((review) => (
          
          <ReviewItem
            key={review.reviewId}
            reviewId={review.reviewId}
            userName={review.nickname ?? ''}
            rating={review.rating}
            content={review.content}
            date={review.reviewDate}
            imageUrl={review.imageUrl}
            tags={review.tags}
            isOwner={review.isOwner ?? false}
            storeId={store.storeId}
            setReviews = {setReviews}
            refreshReviews={() => fetchReviews(0)} 
          />

        )))}
   
        
      </div>

      {/* 더 보기 */}
      {page + 1 < totalPage && (
        <button
          onClick={() => fetchReviews(page + 1)}
          className="mt-[20px] mb-[33.71px] text-center text-[#65CE58] text-sm font-semibold underline decoration-solid decoration-[1px] leading-[20px]"
        >
          리뷰 더 보기
        </button>
      )}

      {/* 로그인 필요 모달 */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </section>
  );
};

export default StoreDetailReview;

import React from 'react';
import ReviewItem from '@/components/StoreDetail/ReviewItem';
import { Store } from '@/types/store';
import AddIcon from '@/assets/svgs/common/add-icon.svg';
import Star from '@/assets/svgs/review/yellow-star.svg';
import CongG from '@/assets/svgs/logo/congG.svg';

interface StoreDetailReviewProps {
  store: Store;
}

const StoreDetailReview: React.FC<StoreDetailReviewProps> = ({ store }) => {
  const { reviews, reviewCount, rating, name } = store;

  return (
    <section className="flex flex-col mt-[12px] ">
      {/* 리뷰쓰기 배너*/}
      <div className="bg-[#F3F5ED] p-[16px]">
        <div className="flex h-[112px]">
          <div className="h-full pb-[16px] text-[15px] font-semibold leading-[20px] flex flex-col gap-[4px] justify-center">
            <p className="text-[#029F64]">{name}</p>
            <p className="text-black">다녀오셨나요?</p>
            <p className="text-black">리뷰를 통해 경험을 공유해주세요!</p>
          </div>
          <img src={CongG} className="w-[122px]" />
        </div>

        <button className="w-full bg-[#65CE58] text-white rounded-[12px] px-[16px] py-[10px] justify-center flex gap-[10px] text-base font-semibold items-center">
          <img src={AddIcon} className="w-[14px] h-[14px] " />
          리뷰쓰기
        </button>
      </div>

      {/* 헤더 */}
      <div className="flex justify-between px-[16px] py-[8px] my-[12px] items-center text-base font-semibold">
        <p>최근 리뷰 {reviewCount}개</p>
        <div className="flex gap-[8px] text-[#919191] leading-[20px]">
          <img src={Star} className="w-[24px]" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* 리뷰 카드 리스트 */}
      <div className="flex flex-col gap-[20px]">
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            userName={review.userName}
            rating={review.rating}
            content={review.content}
            date={review.date}
          />
        ))}
      </div>

      {/* 더 보기 */}
      <button className="mt-[20px] mb-[16.36px] text-center text-[#65CE58] text-sm font-semibold underline decoration-solid decoration-[1px] leading-[20px]">
        리뷰 더 보기
      </button>
    </section>
  );
};

export default StoreDetailReview;

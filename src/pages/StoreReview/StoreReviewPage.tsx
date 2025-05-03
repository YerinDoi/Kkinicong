import React from 'react';
import Header from '@/components/Header';
import StoreInfo from '@/components/StoreReview/StoreInfo';
import { mockStores } from '@/mocks/stores';
import Rating from '@/components/StoreReview/Rating';
import SelectTag from '@/components/StoreReview/SelectTag';
import CommentBox from '@/components/StoreReview/CommentBox';
import UploadImage from '@/components/StoreReview/UploadImage';
import CheckBox from '@/components/StoreReview/Checkbox';

const StoreReviewPage = () => {
  const store = mockStores[0]; // '채움편백찜샤브샤브' 가게 선택. 나중에는 상세페이지와 연관지어 수정 필요요

  return (
    <div>
      <div className="flex flex-col w-full gap-[12px] font-pretendard">
        <Header
          title="리뷰 쓰기"
          showLocationDropdown={false}
          showMenubarButton={false}
        />
        <StoreInfo
          category={store.category.name}
          name={store.name}
          address={store.address}
          badgeText={store.mainTag}
        />
        <div className="px-[16px] flex flex-col gap-[28px]">
          <Rating></Rating>
          <SelectTag></SelectTag>
          <CommentBox></CommentBox>
          <UploadImage></UploadImage>
          <CheckBox></CheckBox>
         
        </div>
      </div>
    </div>
  );
};

export default StoreReviewPage;

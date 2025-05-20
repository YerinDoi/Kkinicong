import React, { useState, useEffect } from 'react';
import YellowStar from '@/assets/svgs/review/yellow-star.svg';
import EmptyStar from '@/assets/svgs/review/disabled-star.svg';
import ProfileImg from '@/assets/svgs/common/profile-img.svg';
import ReportReviewButton from '@/components/StoreDetail/ReportReviewButton';
import DeleteReviewModal from '@/components/StoreDetail/DeleteReview';
import MainTag from '@/components/StoreReview/MainTag';
import axios from '@/api/axiosInstance';

interface ReviewItemProps {
  userName: string;
  date: string;
  rating: number;
  content: string;
  imageUrl: string | null;
  isOwner?: boolean;
  reviewId: number;
  tags?: string[];
  storeId: number;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  userName,
  date,
  rating,
  content,
  imageUrl,
  isOwner,
  reviewId,
  tags,
  storeId
}) => {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const visibleTags = showAllTags ? tags : (tags ?? []).slice(0, 2);
  const hiddenTagCount = (tags?.length ?? 0) - 2;

  useEffect(() => {
    console.log('reviewId:', reviewId);
  }, []);
  useEffect(() => {
    console.log('이미지 URL:', imageUrl);
  }, [imageUrl]);

  const handleDelete = async () => {
    try{
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(
      `/api/v1/${storeId}/review/${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.isSuccess) {
      alert('리뷰가 삭제되었습니다.');
      setShowDeleteModal(false);
    
    } else {
      alert('리뷰 삭제 실패: ' + response.data.message);
    }
  } catch (err) {
    console.error('리뷰 삭제 중 오류:', err);
    alert('리뷰 삭제 중 오류가 발생했습니다.');
  }
};
  

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  return (
    <div className="flex flex-col gap-[12px] px-[16px] pb-[12px] border-b-[1.5px] border-[#E6E6E6]">
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[4px] ">
            <img src={ProfileImg} className="w-[36.3px]" />
            <div className="flex gap-[4px]">
              <span className="font-meidum text-sm">{userName}</span>
              <span className="text-xs text-[#919191] self-end">{date}</span>
            </div>
          </div>
          {isOwner ? (
            <button
              onClick={openDeleteModal}
              className="h-[28px] px-[12px] py-[6px] rounded-[23px] items-center justify-center border-[1px] border-[#919191] bg-[#E6E6E6] text-xs font-medium"
            >
              삭제
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-[8px]">
          {visibleTags?.map((tag, index) => <MainTag key={index} text={tag} />)}

          {!showAllTags && hiddenTagCount > 0 && (
            <MainTag
              text={`+${hiddenTagCount}`}
              onClick={() => setShowAllTags(true)}
            />
          )}
        </div>

        <div className="flex justify-between h-[16.4px]">
          <div className="flex gap-[4px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <img
                key={i}
                src={i < rating ? YellowStar : EmptyStar}
                alt={i < rating ? '채워진 별' : '빈 별'}
                className="w-[17.123px]"
              />
            ))}
          </div>

          {isOwner
            ? null
            : isLoggedIn && (
                <ReportReviewButton
                  reviewId={reviewId}
                  review={{ userName, content }}
                />
              )}
        </div>
      </div>
      <div className="flex gap-auto justify-between">
        <p className="text-sm font-medium leading-[18px] text-[#616161] w-[221px]">
          {content}
        </p>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="리뷰 이미지"
            className="w-[100px] h-[80px] rounded-[12px]"
          />
        )}
      </div>
      {showDeleteModal && (
        <DeleteReviewModal onClose={closeDeleteModal} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ReviewItem;

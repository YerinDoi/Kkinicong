import React, { useState } from 'react';
import YellowStar from '@/assets/svgs/review/yellow-star.svg';
import EmptyStar from '@/assets/svgs/review/disabled-star.svg';
import ProfileImg from '@/assets/svgs/common/profile-img.svg';
import ReportReviewButton from '@/components/StoreDetail/ReportReviewButton';
import DeleteReviewModal from '@/components/StoreDetail/DeleteReview';
import MainTag from '@/components/StoreReview/MainTag';

interface ReviewItemProps {
  userName: string;
  date: string;
  rating: number;
  content: string;
  imageUrl?: string;
  isOwner?: boolean;
  badgeText: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  userName,
  date,
  rating,
  content,
  imageUrl,
  isOwner,
  badgeText,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    // 추후 백엔드 연동시 추가가
    console.log('리뷰 삭제됨');
    setShowDeleteModal(false);
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

        {badgeText && <MainTag text={badgeText} />}
        <div className="flex justify-between h-[16.4px]">
          <div className="flex gap-[4px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <img
                key={i}
                src={i < rating ? YellowStar : EmptyStar}
                alt={i < rating ? '채워진 별' : '빈 별'}
                className="w-[17.123px] "
              />
            ))}
          </div>

          {isOwner ? null : (
            <ReportReviewButton review={{ userName, content }} />
          )}
        </div>
      </div>
      <div className="flex gap-auto">
        <p className="text-sm font-medium leading-[18px] text-[#616161]">
          {content}
        </p>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="리뷰 이미지"
            className="w-[100px] h-[80px] object-cover rounded-[12px]"
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

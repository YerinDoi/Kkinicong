import React, { useState } from 'react';
import YellowStar from '@/assets/svgs/review/yellow-star.svg';
import EmptyStar from '@/assets/svgs/review/disabled-star.svg';
import Modal from '@/components/common/Modal';
import MainTag from '@/components/StoreReview/MainTag';
import axios from '@/api/axiosInstance';
import type { StoreReview } from '@/types/store';
import chevronIcon from '@/assets/svgs/common/chevron.svg';
import { useNavigate } from 'react-router-dom';

interface MyReviewItemProps {
  storeName: string;
  date: string;
  rating: number;
  content: string;
  imageUrl: string | null;
  isOwner?: boolean;
  reviewId: number;
  tags?: string[];
  storeId: number;
  setReviews: React.Dispatch<React.SetStateAction<StoreReview[]>>;
  refreshReviews: () => void;
}

const MyReviewItem: React.FC<MyReviewItemProps> = ({
  storeName,
  date,
  rating,
  content,
  imageUrl,
  reviewId,
  tags,
  storeId,
  setReviews,
  refreshReviews,
}) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const visibleTags = showAllTags ? tags : (tags ?? []).slice(0, 2);
  const hiddenTagCount = (tags?.length ?? 0) - 2;

  const handleDelete = async () => {
    try {
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
        setOpenModal(false);
        refreshReviews();
      } else {
        alert('리뷰 삭제 실패: ' + response.data.message);
      }
    } catch (err) {
      console.error('리뷰 삭제 중 오류:', err);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  const openDeleteModal = () => setOpenModal(true);

  return (
    <div className="flex flex-col px-[16px] pb-[12px] border-b-[1.5px] border-[#E6E6E6]">
      <div className="flex flex-col gap-[12px]">
        {/* 가맹점 이름 + 작성 날짜 + 삭제 버튼 */}
        <div className="flex justify-between items-center grow shrink-0 basis-0">
          <div className="flex items-center gap-[8px]">
            <span
              className="font-pretendard font-medium text-title-sb-button cursor-pointer"
              onClick={() => navigate(`/store/${storeId}`)}
            >
              {storeName}
            </span>
            <img src={chevronIcon} />
            <span className="font-pretendard font-normal text-[12px] leading-[18px] tracking-[0.012px] text-[#919191]">
              {date}
            </span>
          </div>

          <button
            onClick={openDeleteModal}
            className="h-[28px] font-pretendard font-normal text-[12px] leading-[18px] tracking-[0.012px] text-[#919191]"
          >
            삭제
          </button>
        </div>

        {/* 메인 태그 */}
        {visibleTags && visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-[8px]">
            {visibleTags.map((tag, index) => (
              <MainTag key={index} text={tag} />
            ))}
            {!showAllTags && hiddenTagCount > 0 && (
              <MainTag
                text={`+${hiddenTagCount}`}
                onClick={() => setShowAllTags(true)}
              />
            )}
          </div>
        )}

        {/* 별점 */}
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
        </div>

        {/* 리뷰 텍스트 + 이미지 */}
        {(content || imageUrl) && (
          <div className="flex gap-auto justify-between">
            <p
              className={`font-pretendard text-body-md-title font-normal text-[#616161] ${imageUrl ? 'w-[221px]' : ''}`}
            >
              {content || ''}
            </p>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="리뷰 이미지"
                className="w-[100px] h-[80px] rounded-[12px]"
              />
            )}
          </div>
        )}
      </div>

      {/* 탈퇴 확인 모달 */}
      <Modal
        open={openModal}
        title="정말 리뷰를 삭제 하시겠어요?"
        confirmText="삭제하기"
        cancelText="취소"
        onConfirm={async () => {
          handleDelete();
          setOpenModal(false);
        }}
        onCancel={() => setOpenModal(false)}
      />
    </div>
  );
};

export default MyReviewItem;

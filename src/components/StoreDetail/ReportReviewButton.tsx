import React, { useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import BottomSheetForm from '@/components/common/BottomSheetForm';
import ConfirmToast from '@/components/common/ConfirmToast';
import AlarmIcon from '@/assets/svgs/common/alarm.svg';
import axiosInstance from '@/api/axiosInstance';
import axios from 'axios';
import { createPortal } from 'react-dom';

interface Props {
  onClick?: () => void;
  reviewId: number;
  review: {
    userName: string;
    content: string;
  };
}

const ReportReviewButton: React.FC<Props> = ({ onClick, review, reviewId }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const reasonMap = {
    '부적절한 언어 사용 (욕설, 비방 등)': 'ABUSIVE_LANGUAGE',
    '허위 정보 제공': 'FAKE_INFO',
    '개인정보 노출': 'PRIVACY',
    '스팸홍보/도배': 'SPAM',
    기타: 'ETC',
  } as const;

  const handleClick = () => {
    onClick?.();
    setIsEditOpen(true); // 바텀시트 열기
  };

  const handleEditSubmit = async (reason: string, description: string) => {
    const token = localStorage.getItem('accessToken');
    const mappedReason = reasonMap[reason as keyof typeof reasonMap];
    if (!token) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    if (!mappedReason) {
      alert('신고 사유가 유효하지 않습니다.');
      return;
    }

    try {
      await axiosInstance.post(
        `/api/v1/report/review/${reviewId}`,
        {
          description: mappedReason === 'ETC' ? description : null,
        },
        {
          params: { reason: mappedReason },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('리뷰 신고 전송됨');
      setIsEditOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorCode = error.response?.data?.code;
        console.error('신고 실패 코드:', errorCode);

        if (errorCode === 'REPORT_ALREADY_EXISTS') {
          alert('이미 신고한 리뷰입니다.');
          return;
        }

        alert('리뷰 신고에 실패했습니다.');
      } else {
        alert('예상치 못한 오류가 발생했습니다.');
      }
    }
  };

  const handleCloseClick = () => {
    console.log('모달 닫힘');
    setIsEditOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="text-xs font-medium text-[#919191] flex gap-[4px]"
      >
        <img src={AlarmIcon} className="h-[14px]" />
        <p>신고하기</p>
      </button>

      <BottomSheet isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <BottomSheetForm
          title="리뷰 신고하기"
          radioOptions={[
            '부적절한 언어 사용 (욕설, 비방 등)',
            '허위 정보 제공',
            '개인정보 노출',
            '스팸홍보/도배',
            '기타',
          ]}
          question="어떤 문제가 있나요?"
          buttonText="신고하기"
          onSubmit={handleEditSubmit}
          onCancel={handleCloseClick}
          reviewInfo={review}
        />
      </BottomSheet>
      {showToast && (
         createPortal(
          <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
            <ConfirmToast text="신고 완료! " />
          </div>,
          document.body
        )
      )}
    </>
  );
};

export default ReportReviewButton;

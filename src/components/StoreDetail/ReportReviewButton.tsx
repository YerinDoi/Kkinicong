import React, { useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import BottomSheetForm from '@/components/common/BottomSheetForm';
import ConfirmToast from '@/components/common/ConfirmToast';
import AlarmIcon from '@/assets/svgs/common/alarm.svg';


interface Props {
  onClick?: () => void;
  review: {
    userName: string;
    content: string;
  };
}

const ReportReviewButton: React.FC<Props> = ({ onClick, review }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    onClick?.();
    setIsEditOpen(true); // 바텀시트 열기
  };

  const handleEditSubmit = () => {
    console.log('신고 제출');
    setIsEditOpen(false); // 바텀시트 닫기
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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
        <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
          <ConfirmToast text="신고 완료! " />
        </div>
      )}
    </>
  );
};

export default ReportReviewButton;

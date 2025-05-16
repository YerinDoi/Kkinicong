import React, { useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import BottomSheetForm from '@/components/common/BottomSheetForm';
import ConfirmToast from '@/components/common/ConfirmToast';

interface Props {
  onClick?: () => void;
  storeInfo?: {
    name: string;
    category?: string;
    mapComponent?: React.ReactNode;
  };
}

const RequestEditButton: React.FC<Props> = ({ onClick, storeInfo }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    onClick?.();
    setIsEditOpen(true); // 바텀시트 열기
  };

  const handleEditSubmit = () => {
    console.log('수정 요청 전송됨');
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
        className="inline-flex items-center h-[24px] bg-[#F4F6F8] text-black-500 border-[1.5px] border-[#919191] text-xs px-[12px] py-[6px] rounded-[12px]"
      >
        가게 수정 요청하기
      </button>

      <BottomSheet isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <BottomSheetForm
          title="가게 정보 수정 요청하기"
          radioOptions={[
            '음식 카테고리',
            '위치',
            '영업시간',
            '폐업한 가게',
            '기타',
          ]}
          question="어떤 정보가 잘못되었나요?"
          buttonText="수정 요청하기"
          onSubmit={handleEditSubmit}
          onCancel={handleCloseClick}
          storeInfo={storeInfo}
        />
      </BottomSheet>
      {showToast && (
        <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
          <ConfirmToast text="수정 요청 완료! " />
        </div>
      )}
    </>
  );
};

export default RequestEditButton;

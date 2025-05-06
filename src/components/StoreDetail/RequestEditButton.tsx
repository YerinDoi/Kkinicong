import React, { useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import EditStore from './EditStore';

interface Props {
  onClick?: () => void;
}

const RequestEditButton: React.FC<Props> = ({ onClick }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleClick = () => {
    onClick?.();           // 외부 동작 (선택적)
    setIsEditOpen(true);   // 바텀시트 열기
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
        <EditStore />
      </BottomSheet>
    </>
  );
};

export default RequestEditButton;

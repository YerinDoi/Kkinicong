import React from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/common/Button';

interface ConfirmModalProps {
  title: string;
  onClose: () => void;
  onDelete: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  onClose,
  onDelete,
}) => {
  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-[9998] flex justify-center items-center">
      <div className="py-[36px] px-[20px] font-pretendard bg-white rounded-[12px] w-[300px]">
        <div className="flex flex-col gap-[24px] items-center">
           <div className="text-center py-[8px] px-[16px] text-black text-title-sb-button font-bold">
            {title}
          </div>
          <div className="flex w-full justify-center gap-[12px] ">
            <Button
              text="취소하기"
              onClick={onClose}
              heightClass="h-[44px]"
              widthClass="w-1/2"
            />
            <Button
              text="삭제하기"
              onClick={onDelete}
              heightClass="h-[44px]"
              widthClass="w-1/2"
              bgColorClass="bg-main-gray"
              textColorClass="text-white"
            />
        </div>
          
         
        </div>
        
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmModal;

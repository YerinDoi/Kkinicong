import React from 'react';
import { createPortal } from 'react-dom';
import TrashIcon from '@/assets/svgs/review/trash.svg';
import Button from '@/components/common/Button';
import OptimizedImage from './OptimizedImage';

interface DeleteModalProps {
  title: string;
  description: string;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  title,
  description,
  onClose,
  onDelete,
}) => {
  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-[9998] flex justify-center items-center">
      <div className="pt-[45px] font-pretendard bg-white rounded-[12px]">
        <div className="flex flex-col px-[66px] gap-[28px] items-center">
          <OptimizedImage src={TrashIcon} alt="휴지통 아이콘" className="w-[40px] h-[40px]" />
          <div className="text-center flex flex-col gap-[8px]">
            <p className="text-black text-title-sb-button font-bold">{title}</p>
            <p className="text-body-md-title font-regular text-[#919191]">
              {description}
            </p>
          </div>
        </div>
        <div className="flex w-full justify-center gap-[8px] mt-[34px] mb-[14px] px-[16px]">
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
            bgColorClass="bg-[#919191]"
            textColorClass="text-white"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default DeleteModal;

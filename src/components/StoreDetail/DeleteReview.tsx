import React from 'react';
import TrashIcon from '@/assets/svgs/review/trash.svg';
import Button from '@/components/common/Button';
import { createPortal } from 'react-dom';

interface DeleteReviewModalProps {
  onClose: () => void;
  onDelete: () => void;
}

const DeleteReviewModal: React.FC<DeleteReviewModalProps> = ({
  onClose,
  onDelete,
}) => {
  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-[9998] flex justify-center items-center">
      <div className="pt-[45px]  font-pretendard bg-white rounded-[12px] ">
        <div className="flex flex-col px-[66px] gap-[28px] items-center">
          <img src={TrashIcon} className="w-[40px] h-[40px]" />

          <div className="text-center flex flex-col gap-[8px]">
            <p className="text-black text-title-sb-button font-bold">
              리뷰를 정말 삭제하시겠어요?
            </p>
            <p className="text-body-md-title font-regular text-[#919191]">
              삭제된 리뷰는 복구시킬 수 없어요
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

export default DeleteReviewModal;

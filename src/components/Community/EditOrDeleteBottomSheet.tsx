import BottomSheet from '@/components/common/BottomSheet';
import React from 'react';
import Icon from '@/assets/icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EditOrDeleteBottomSheet: React.FC<Props> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="py-[16px] flex flex-col gap-[20px] text-title-sb-button font-bold">
        <div className="flex flex-col gap-[8px]">
          <div
            className="px-[28px] py-[12px] flex gap-[10px] cursor-pointer"
            onClick={onDelete}
          >
            <Icon name="delete" />
            <span>삭제하기</span>
          </div>
          <div
            className="px-[28px] py-[12px] flex gap-[10px] cursor-pointer"
            onClick={onEdit}
          >
            <Icon name="edit" />
            <span>수정하기</span>
          </div>
        </div>
        <div
          className="flex justify-center border-t-[2px] border-[#F4F6F8] py-[12px] cursor-pointer"
          onClick={onClose}
        >
          취소
        </div>
      </div>
    </BottomSheet>
  );
};

export default EditOrDeleteBottomSheet;

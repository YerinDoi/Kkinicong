import React from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  description,
  confirmText = '삭제하기',
  cancelText = '취소',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-[12px] w-[300px] px-[20px] py-[36px] flex flex-col items-center gap-[24px]">
        <div className="px-[16px] py-[8px] font-pretendard text-[16px] font-semibold leading-normal tracking-[0.016px] text-center">{title}</div>
        {description && (
          <div className="text-[15px] text-[#616161] text-center mb-6">
            {description}
          </div>
        )}
        <div className="flex w-full gap-[12px]">
          <button
            className="flex-1 h-[44px] rounded-[12px] px-[20px] py-[12px] border-[1.5px] border-[#C3C3C3] 
                font-pretendard text-[#616161] font-medium text-[16px] leading-[20px] bg-white"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`flex-1 h-[44px] rounded-[12px] px-[16px] py-[10px] 
                font-pretendard font-medium text-[16px] leading-normal tracking-[0.016px] text-white bg-[#919191]`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

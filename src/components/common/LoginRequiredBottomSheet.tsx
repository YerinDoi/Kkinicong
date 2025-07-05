import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomSheet from '@/components/common/BottomSheet';
import Icon from '@/assets/icons';

interface LoginRequiredBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  pendingPath?: string | null;
}

const LoginRequiredBottomSheet: React.FC<LoginRequiredBottomSheetProps> = ({
  isOpen,
  onClose,
  pendingPath,
}) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();
    navigate('/login', { state: { redirectTo: pendingPath } });
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center pt-[28px] pb-[44px] gap-[20px]">
        <div className="flex flex-col items-center justify-center gap-[20px]">
          <Icon name="login" className="w-[40px] h-[52px] text-main-color" />

          <div className="flex flex-col items-center gap-[8px] text-center">
            <span className="text-[16px] font-bold text-[#212121] tracking-[0.016px] leading-none">
              로그인이 필요한 기능이에요
            </span>
            {/* 서브텍스트 */}
            <span className="text-[14px] font-regular text-[#919191] leading-[18px]">
              로그인 후 더 많은 기능을 이용해볼까요?
            </span>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-[8px] w-full px-[18px]">
          <button
            className="flex flex-col justify-center items-center w-[117px] h-[44px] px-[20px] py-[12px] rounded-[12px] border-[1.5px] border-[#C3C3C3] text-[#616161] font-medium bg-white font-pretendard"
            onClick={onClose}
          >
            취소하기
          </button>
          <button
            className="flex flex-col justify-center items-center h-[44px] px-[20px] py-[12px] flex-1 basis-0 rounded-[12px] bg-main-color text-white font-medium font-pretendard"
            onClick={handleLoginClick}
          >
            로그인 하기
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default LoginRequiredBottomSheet;

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import CongG from '@/assets/svgs/logo/card-congG.svg';
import GradientBg from '@/assets/svgs/common/region-update-gradient-bg.svg';

interface Props {
  open: boolean;
  onGoHome: () => void;
  onDontShowAgain: () => void;
}

// 서울 지역 추가 안내 다이얼로그
const RegionUpdateDialog: React.FC<Props> = ({
  open,
  onGoHome,
  onDontShowAgain,
}) => {
  // body 스크롤 잠금 처리
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  if (!open) return null;

  const dialog = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
      <div
        className="relative bg-white rounded-[12px] overflow-hidden w-[287px] h-[415px]"
        role="dialog"
        aria-modal="true"
        aria-label="지역 업데이트 안내"
      >
        {/* 상단 배경 */}
        <div className="relative overflow-hidden w-[287px] h-[368px] bg-[#F3F5ED]">
          {/* 그라데이션 원 배경 (SVG) */}
          <img
            src={GradientBg}
            className="absolute left-0 top-0 object-cover"
            aria-hidden
          />

          {/* 텍스트 영역 */}
          <div className="relative pt-[33px] text-center flex flex-col items-center z-[100]">
            <div className="mx-auto truncate mb-[6px] font-pretendard text-[16px] font-semibold leading-[130%] text-white">
              현재 서비스 지역은
            </div>

            <div className="flex justify-center w-[270px] h-[64px] items-center flex-shrink-0">
              <div
                className="font-pretendard font-bold text-center flex flex-col gap-[6px] text-[24px] leading-[116%]"
                style={{
                  background: 'linear-gradient(0deg, #F3F5ED 0%, #FFF 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <span>서울 인천 부천 수원</span>
                <span>고양 용인 부산 성남</span>
              </div>
            </div>

            <div className="font-pretendard text-center mt-[6px] w-[270px] h-[18px] text-[12px] font-regular leading-[150%] tracking-[0.012px] text-white">
              다른 지역은 추후에 추가될 예정이에요
            </div>
          </div>

          {/* 콩쥐 이미지 */}
          <div className="absolute mt-[2px]bottom-0 left-1/2 -translate-x-1/2 w-[226px] z-[50]">
            <img
              src={CongG}
              alt="카드를 든 콩쥐"
              className="w-full h-auto object-bottom"
            />
          </div>

          {/* 블러 영역 */}
          <div className="absolute bottom-0 w-full h-[41px] flex-shrink-0 bg-gradient-to-b from-[rgba(243,245,237,0)] to-[#F3F5ED] z-[200]"></div>
        </div>

        {/* 버튼 영역 */}
        <div className="absolute left-0 right-0 bottom-0 flex h-[47px]">
          <button
            className="flex-1 h-[47px] border-sub-gray text-[#616161] font-pretendard text-[16px] font-semibold leading-[20px]"
            onClick={onGoHome}
          >
            구경하러 가기
          </button>
          <div className="w-[0.5px] bg-sub-gray" />
          <button
            className="flex-1 h-[47px] border-sub-gray text-[#616161] font-pretendard text-[16px] font-normal leading-[20px]"
            onClick={onDontShowAgain}
          >
            다시 보지 않기
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
};

export default RegionUpdateDialog;

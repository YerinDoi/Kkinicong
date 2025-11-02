import React from 'react';
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
      <div
        className="relative bg-white rounded-[12px] overflow-hidden w-[287px] h-[415px]"
        role="dialog"
        aria-modal="true"
        aria-label="서울 지역 가맹점 업데이트 안내"
      >
        {/* 상단 배경 */}
        <div
          className="relative overflow-hidden w-[287px] h-[368px] bg-[#F3F5ED]"
        >
          {/* 그라데이션 원 배경 (SVG) */}
          <img
            src={GradientBg}
            className="absolute left-0 top-0 object-cover"
            aria-hidden
          />

          {/* 텍스트 영역 */}
          <div className="relative pt-[36px] text-center flex flex-col items-center z-10">
            <div
              className="mx-auto truncate mb-[6px]"
              style={{
                fontFamily: 'Pretendard',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '130%',
                color: '#FFF',
              }}
            >
              많은 분들이 요청해주신
            </div>

            <div
              className="flex justify-center w-[182px] h-[64px] items-center flex-shrink-0"
            >
              <div
                className="font-bold text-center flex flex-col gap-[6px]"
                style={{
                  fontFamily: 'Pretendard',
                  fontSize: 24,
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '116%',
                  background: 'linear-gradient(0deg, #F3F5ED 0%, #FFF 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <span>서울 지역 가맹점이</span>
                <span>업데이트 되었어요!</span>
              </div>
            </div>

            
          </div>

          {/* 콩쥐 이미지 */}
          <div className="absolute bottom-0 justify-center left-1/2 -translate-x-1/2 w-[237px] aspect-[237/263] z-100">
            <img src={CongG} alt="카드를 든 콩쥐" />
          </div>

          {/* 블러 영역 */}
          <div className="absolute bottom-0 w-full h-[41px] flex-shrink-0 bg-gradient-to-b from-[rgba(243,245,237,0)] to-[#F3F5ED] z-[999]"></div>
        </div>

        {/* 버튼 영역 */}
        <div className="left-0 right-0 bottom-0 flex">
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
};

export default RegionUpdateDialog;

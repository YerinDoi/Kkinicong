import React from 'react';
import CuriousCongG from '@/assets/svgs/logo/curious-congG.svg?react';
import SadCongG from '@/assets/svgs/logo/sad-congG.svg?react';

type NoResultType = 'search' | 'nearby';

interface NoSearchResultsProps {
  type: NoResultType;
  query?: string;
  suggestedSearchTerm?: string; // 추천 검색어 (선택 사항)
  onSuggestClick?: (term: string) => void; // 추천 검색어 클릭 시 실행될 함수
}

const NoSearchResults: React.FC<NoSearchResultsProps> = ({
  type,
  query,
  suggestedSearchTerm,
  onSuggestClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-[20px]">
        {type === 'search' ? <CuriousCongG /> : <SadCongG />}
      </div>

      {/* 메시지 영역 */}
      <div className="text-center font-pretendard text-[14px] font-normal leading-[24px]">
        {type === 'search' ? (
          <>
            <span className="text-[#212121]">'{query}'</span>
            <span className="text-[#919191]">
              <span>와 관련한</span> <p>검색 결과가 없어요</p>
            </span>
          </>
        ) : (
          <>
            <span className="text-[#919191]">내 주위에 가까운</span>
            <span className="text-[#919191]">
              <p>가맹점이 없어요</p>
            </span>
          </>
        )}
      </div>

      {/* 추천 검색어 영역 (추천 검색어가 있을 경우만 표시) */}
      {suggestedSearchTerm && (
        <button
          className="text-[#919191] text-center font-pretendard text-[14px] font-normal leading-[18px] underline mt-2"
          onClick={() => onSuggestClick && onSuggestClick(suggestedSearchTerm)}
        >
          '{suggestedSearchTerm}'를 찾으셨나요?
        </button>
      )}
    </div>
  );
};

export default NoSearchResults;

import React from 'react';
import CuriousCongG from '@/assets/svgs/logo/curious_congG.svg?react';

interface NoSearchResultsProps {
  query: string; // 사용자가 검색한 키워드
  suggestedSearchTerm?: string; // 추천 검색어 (선택 사항)
  onSuggestClick?: (term: string) => void; // 추천 검색어 클릭 시 실행될 함수
}

const NoSearchResults: React.FC<NoSearchResultsProps> = ({
  query,
  suggestedSearchTerm,
  onSuggestClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-[20px]">
        <CuriousCongG />
      </div>

      {/* 메시지 영역 */}
      <div className="text-center font-pretendard text-[14px] font-medium leading-[18px]">
        <span className="text-[#212121]">
          '{query}'
        </span>
        <span className="text-[#919191]">
          <span>와 관련한</span> <p>검색 결과가 없어요</p>
        </span>
      </div>

      {/* 추천 검색어 영역 (추천 검색어가 있을 경우만 표시) */}
      {suggestedSearchTerm && (
        <button
          className="text-[#919191] text-center font-pretendard text-[14px] font-medium leading-[18px] underline mt-2"
          onClick={() => onSuggestClick && onSuggestClick(suggestedSearchTerm)}
        >
          '{suggestedSearchTerm}'를 찾으셨나요?
        </button>
      )}
    </div>
  );
};

export default NoSearchResults;

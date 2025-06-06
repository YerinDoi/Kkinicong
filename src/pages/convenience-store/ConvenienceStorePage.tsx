import SearchInput from '@/components/common/SearchInput';
import TopBar from '@/components/common/TopBar';
import InfoShareCard from '@/components/ConvenienceStore/InfoShareCard';

// 전체에 노란색 배경 적용하고
// 하단의 제품 목록 섹션만 흰색 배경으로 설정
// 일단 상단 먼저 구현
// 1. 탑바 import
// 2. 검색바 import
// 3. 카드

const ConvenienceStorePage = () => {
  return (
    <div className="flex flex-col h-full bg-[#FFF5DF]">
      {/* 상단 : 탑바, 검색바, 정보 카드*/}
      <TopBar title="편의점 구매정보" />

      <div className="px-4">
        <SearchInput
          placeholder="CU, 불닭볶음면 ..."
          value=""
          onChange={() => {}}
          onSearch={() => {}}
        />
      </div>

      <InfoShareCard />

      {/* 하단 */}
    </div>
  );
};

export default ConvenienceStorePage;

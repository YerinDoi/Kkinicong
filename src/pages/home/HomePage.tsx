import { Helmet } from 'react-helmet-async';

import HeaderToCarouselSection from '@/components/home/HeaderToCarouselSection';
import CategorySection from '@/components/home/CategorySection';
import Top8StoreSection from '@/components/home/Top8StoreSection';
import ConvenienceStoreSection from '@/components/home/ConvenienceStoreSection';
import CommunitySection from '@/components/home/CommunitySection';

function HomePage() {
  return (
    <>
      <Helmet>
        {/* 브라우저 탭/검색결과 제목 */}
        <title>끼니콩</title>

        {/* 네이버 검색결과 설명 */}
        <meta
          name="description"
          content="가까운 아동급식카드 가맹점 이곳에서 찾아봐요"
        />

        {/* Open Graph (카톡/네이버 블로그 등 공유 시 미리보기) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="끼니콩" />
        <meta
          property="og:description"
          content="가까운 아동급식카드 가맹점 이곳에서 찾아봐요"
        />
        <meta property="og:url" content="https://kkinicong.co.kr" />
        <meta property="og:image" content="https://kkinicong.co.kr/og-image.png" />
      </Helmet>

      <div className="flex flex-col font-pretendard pb-[61px]">
        <HeaderToCarouselSection />

        <div className="flex flex-col gap-[16px]">
          <CategorySection />
          <Top8StoreSection />
          <ConvenienceStoreSection />
          <CommunitySection />
        </div>
      </div>
    </>
  );
}

export default HomePage;

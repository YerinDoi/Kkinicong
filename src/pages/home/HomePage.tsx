import HeaderToCarouselSection from '@/components/home/HeaderToCarouselSection';
import CategorySection from '@/components/home/CategorySection';
import Top8StoreSection from '@/components/home/Top8StoreSection';
import ConvenienceStoreSection from '@/components/home/ConvenienceStoreSection';

function HomePage() {
  return (
    <div className="flex flex-col font-pretendard">
      <HeaderToCarouselSection />

      <div className="flex flex-col gap-[16px]">
        <CategorySection />
        <Top8StoreSection />
        <ConvenienceStoreSection />
      </div>
    </div>
  );
}

export default HomePage;

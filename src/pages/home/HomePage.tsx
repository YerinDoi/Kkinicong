import HeaderToCarouselSection from '@/components/home/HeaderToCarouselSection';
import CategorySection from '@/components/home/CategorySection';
import Top8StoreSection from '@/components/home/Top8StoreSection';
function HomePage() {
  return (
    <div className="flex flex-col font-pretendard">
      <HeaderToCarouselSection />

      <div className="flex flex-col gap-[16px]">
        <CategorySection />
        <Top8StoreSection />
        <span>편의점 구매 가능 리스트</span>
      </div>
    </div>
  );
}

export default HomePage;

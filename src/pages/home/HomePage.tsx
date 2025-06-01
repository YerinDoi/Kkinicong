import HeaderToCarouselSection from "@/components/home/HeaderToCarouselSection";
import CategorySection from "@/components/home/CategorySection";

function HomePage() {
  return (
    <div className="flex flex-col font-pretendard">
      <HeaderToCarouselSection/>
      <CategorySection/>
      <span>오늘 끼니는 여기 어때요?</span>
      <span>편의점 구매 가능 리스트</span>
    </div>
    
  );
}

export default HomePage;


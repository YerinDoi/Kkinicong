import HomeTopBar from '@/components/home/HomeTopBar';

function HomePage() {
  return (
    <div className="font-sans bg-[#F3F5ED)] min-h-screen">
      <HomeTopBar />
      <div className="px-4 pt-1 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold">홈 페이지</h1>
          <p className="mt-4 text-lg">여기는 홈 페이지입니다.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

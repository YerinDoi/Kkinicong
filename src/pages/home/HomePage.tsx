import HomeTopBar from '@/components/home/HomeTopBar';
import MenuBar from '@/components/common/MenuBar';
import { useState } from 'react';

function HomePage() {
  const [isMenuBarOpen, setIsMenuBarOpen] = useState(false);

  const handleMenuButtonClick = () => {
    setIsMenuBarOpen(true);
  };

  const handleCloseMenuBar = () => {
    setIsMenuBarOpen(false);
  };

  return (
    <div className="px-4 pt-1 max-w-md mx-auto font-sans bg-[#F3F5ED]">
      <HomeTopBar onMenuClick={handleMenuButtonClick} />
      <MenuBar isOpen={isMenuBarOpen} onClose={handleCloseMenuBar} />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">홈 페이지</h1>
        <p className="mt-4 text-lg">여기는 홈 페이지입니다.</p>
      </div>
    </div>
  );
}

export default HomePage;

import HeaderToCarouselSection from '@/components/home/HeaderToCarouselSection';
import CategorySection from '@/components/home/CategorySection';
import Top8StoreSection from '@/components/home/Top8StoreSection';
import ConvenienceStoreSection from '@/components/home/ConvenienceStoreSection';
import CommunitySection from '@/components/home/CommunitySection';
import { useEffect, useState } from 'react';
import RegionUpdateDialog from '@/components/common/RegionUpdateDialog';

function HomePage() {
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem('hideRegionUpdateDialog');
    if (hidden !== 'true') setOpenDialog(true);
  }, []);

  return (
    <>
      <div className="flex flex-col font-pretendard pb-[61px]">
        <HeaderToCarouselSection />

        <div className="flex flex-col gap-[16px]">
          <CategorySection />
          <Top8StoreSection />
          <ConvenienceStoreSection />
          <CommunitySection />
        </div>
      </div>
      <RegionUpdateDialog
        open={openDialog}
        onGoHome={() => setOpenDialog(false)}
        onDontShowAgain={() => {
          localStorage.setItem('hideRegionUpdateDialog', 'true');
          setOpenDialog(false);
        }}
      />
    </>
  );
}

export default HomePage;

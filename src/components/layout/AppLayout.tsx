import { useLocation } from 'react-router-dom';
import FloatingButton from '@/components/common/FloatingButton';

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  const location = useLocation();
  const isCommunityPage = location.pathname === '/community';

  return (
    <div className="w-screen real-vh bg-gray-100 relative">
      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-full max-w-[375px] real-vh bg-white overflow-y-scroll scrollbar-hide"
      >
        {children}
      </div>

      {/* 고정 버튼 - 화면 전체 기준으로 fixed */}
      {isCommunityPage && (
        <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-full max-w-[375px] z-50">
          <div className="pointer-events-auto flex justify-end pr-[20px]">
            <FloatingButton />
          </div>
        </div>
      )}
    </div>
  );
}

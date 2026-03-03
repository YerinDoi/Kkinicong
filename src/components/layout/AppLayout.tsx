import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import FloatingButton from '@/components/common/FloatingButton';
import axiosInstance from '@/api/axiosInstance';

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const isCommunityPage = location.pathname === '/community';

  // 로그인 상태일 때 nickname 체크 및 리다이렉트
  useEffect(() => {
    const checkUserNickname = async () => {
      if (
        !isLoggedIn ||
        location.pathname === '/nickname' ||
        location.pathname === '/login'
      ) {
        return;
      }

      try {
        const response = await axiosInstance.get('/api/v1/user/nickname');
        const nickname = response.data.results?.nickname;

        if (!nickname) {
          navigate('/nickname', { replace: true });
        }
      } catch (error) {
        console.error('사용자 정보 확인 실패:', error);
      }
    };

    checkUserNickname();
  }, [isLoggedIn, location.pathname, navigate]);

  return (
    <div id="app-shell" className="w-screen real-vh bg-gray-100 relative">
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

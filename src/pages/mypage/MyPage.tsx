import Header from '@/components/Header';
import ProfileSection from '@/components/Mypage/ProfileSection';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import FavoriteStoreCard from '@/components/Mypage/FavoriteStoreCard';
import MenuListBtn from '@/components/Mypage/MenuListBtn';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '@/api/axiosInstance';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';

const MyPage = () => {
  const { isLoggedIn } = useLoginStatus();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [isNicknameModified, setIsNicknameModified] = useState(false);
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    axios.get('/api/v1/user/nickname').then((res) => {
      setNickname(res.data.results.nickname);
      setIsNicknameModified(res.data.results.isNicknameModified);
    });
  }, [isLoggedIn]);

  const handleLogin = () => {
    navigate('/login', { state: { redirectTo: '/mypage' } });
  };

  const handleProtectedRoute = (targetPath: string) => {
    if (!isLoggedIn) {
      setPendingPath(targetPath);
      setShowLoginSheet(true);
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className="flex flex-col items-center w-full pt-[11px]">
      <Header title="마이페이지" />

      <div className="px-[30px] my-[24px]">
        <ProfileSection
          isLoggedIn={isLoggedIn}
          nickname={nickname}
          canEditNickname={!isNicknameModified}
          onLogin={handleLogin}
          onEditNickname={() => navigate('/nickname-edit')}
        />
      </div>

      <div className="flex flex-col px-[20px] w-full gap-[20px]">
        <FavoriteStoreCard
          count={0}
          onClick={() => handleProtectedRoute('/my-favorite-stores')}
        />
        <div className="flex flex-col gap-[8px]">
          <MenuListBtn
            label="내가 쓴 글"
            variant="default"
            onClick={() => handleProtectedRoute('/my-posts')}
          />
          <MenuListBtn
            label="내가 쓴 리뷰"
            variant="default"
            onClick={() => handleProtectedRoute('/my-reviews')}
          />
          <MenuListBtn
            label="좋아요"
            variant="default"
            onClick={() => handleProtectedRoute('/my-likes')}
          />
          <MenuListBtn
            label="즐겨찾는 지역"
            variant="default"
            onClick={() => handleProtectedRoute('/my-neighborhood')}
          />
        </div>
      </div>

      <hr
        className="w-full my-[20px]"
        style={{
          border: 'none',
          borderTop: '1.5px solid #E6E6E6',
          height: 0,
          transform: 'rotate(0.153deg)',
          flexShrink: 0,
        }}
      />

      <div className="flex flex-col px-[20px] w-full gap-[8px]">
        <MenuListBtn
          label="약관 및 정책"
          variant="secondary"
          onClick={() =>
            window.open(
              'https://buttercup-crate-151.notion.site/20b0b19ad28b80418f3ee6db65b4c505?source=copy_link',
              '_blank',
            )
          }
        />
        <MenuListBtn label="의견 남기기" variant="secondary" />
        {isLoggedIn && (
          <MenuListBtn
            label="회원 탈퇴"
            variant="secondary"
            onClick={() => navigate('/account-delete')}
          />
        )}
      </div>

      {/* 로그인 바텀시트 */}
      <LoginRequiredBottomSheet
        isOpen={showLoginSheet}
        onClose={() => setShowLoginSheet(false)}
        pendingPath={pendingPath}
      />
    </div>
  );
};

export default MyPage;

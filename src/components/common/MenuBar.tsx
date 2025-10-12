import Icon from '@/assets/icons';
import { useNavigate } from 'react-router-dom';
import type { IconName } from '@/assets/icons';
import ReactDOM from 'react-dom';
import { useLogout } from '@/hooks/useLogout';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import { useState } from 'react';
import Modal from '@/components/common/Modal';

interface MenuBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuBar = ({ isOpen, onClose }: MenuBarProps) => {
  const navigate = useNavigate();
  const { handleLogout } = useLogout();
  const { isLoggedIn, setIsLoggedIn } = useLoginStatus();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutWithClose = () => {
    setIsLogoutModalOpen(false);
    handleLogout();
    setIsLoggedIn(false);
    onClose();
    window.location.replace('/');
  };

  const menuItems = [
    { icon: 'mainpage' as IconName, text: '메인페이지', path: '/' },
    { icon: 'store-map' as IconName, text: '가맹점 지도', path: '/store-map' },
    {
      icon: 'store-search' as IconName,
      text: '가맹점 찾기',
      path: '/store-search',
    },
    {
      icon: 'convenience-store' as IconName,
      text: '편의점 구매정보',
      path: '/convenience',
    },
    { icon: 'community' as IconName, text: '커뮤니티', path: '/community' },
    isLoggedIn
      ? { icon: 'login' as IconName, text: '로그아웃' }
      : { icon: 'login' as IconName, text: '로그인', path: '/login' },
    { icon: 'mypage' as IconName, text: '마이페이지', path: '/mypage' },
  ];

  const portalTarget = document.getElementById('app-shell') ?? document.body;

  const panel = (
    <>
      {/* 뒤쪽 오버레이: 화면 클릭 시 닫힘 (패널과 '형제') */}
      <div
        className={`fixed inset-0 z-[9998] transition-opacity duration-200
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* 상단 패널: 컨텐츠 폭만 덮기 */}
      <div
        className={`fixed left-1/2 top-0 -translate-x-1/2 z-[9999]
                    w-[375px] max-w-full
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <div
          className={`pt-[5px] bg-white ${
            isOpen
              ? 'shadow-[0_4px_24px_0px_rgba(0,0,0,0.30)]'
              : 'shadow-none'
          }`}
          onClick={(e) => e.stopPropagation()} // 내부 클릭은 닫힘 방지
        >
          <div className="flex flex-col p-[20px] pb-[28px] gap-[20px]">
            <button className="flex justify-end" onClick={onClose} aria-label="닫기">
              <Icon name="close-btn" />
            </button>

            <div className="flex flex-col gap-[20px]">
              {menuItems.map((item, index) => (
                <div key={item.text}>
                  <button
                    className="flex items-center gap-[16px] w-full text-left"
                    onClick={() => {
                      if (item.text === '로그아웃') {
                        setIsLogoutModalOpen(true);
                        onClose();
                      } else if (item.path) {
                        navigate(item.path);
                        onClose();
                      }
                    }}
                  >
                    <Icon name={item.icon} />
                    <span className="text-[#212121] text-[14px] font-normal leading-[18px]">
                      {item.text}
                    </span>
                  </button>
                  {index === 4 && (
                    <div className="mt-[4px] pb-[20px] border-b-4 border-bg-gray" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {ReactDOM.createPortal(panel, portalTarget)}
      <Modal
        open={isLogoutModalOpen}
        title="정말 로그아웃 하시겠어요?"
        confirmText="로그아웃"
        cancelText="취소"
        onConfirm={handleLogoutWithClose}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};

export default MenuBar;
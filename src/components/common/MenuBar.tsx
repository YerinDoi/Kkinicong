import Icon from '@/assets/icons';
import { useNavigate } from 'react-router-dom';
import type { IconName } from '@/assets/icons';
import ReactDOM from 'react-dom';
import { useLogout } from '@/hooks/useLogout';
import { useLoginStatus } from '@/hooks/useLoginStatus';

interface MenuBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuBar = ({ isOpen, onClose }: MenuBarProps) => {
  const navigate = useNavigate();
  const { handleLogout } = useLogout();
  const { isLoggedIn, setIsLoggedIn } = useLoginStatus();

  const handleLogoutWithClose = () => {
    handleLogout();
    setIsLoggedIn(false); // 상태 즉시 업데이트
    onClose();
  };

  const menuItems = [
    { icon: 'store-map' as IconName, text: '가맹점 지도', path: '/store-map' },
    {
      icon: 'store-search' as IconName,
      text: '가맹점 찾기',
      path: '/store-search',
    },
    {
      icon: 'convenience-store' as IconName,
      text: '편의점 구매가능 품목 게시판',
      path: '/convenience',
    },
    { icon: 'community' as IconName, text: '커뮤니티', path: '/community' },
    isLoggedIn
      ? { icon: 'login' as IconName, text: '로그아웃' }
      : { icon: 'login' as IconName, text: '로그인', path: '/login' },
    { icon: 'mypage' as IconName, text: '마이페이지', path: '/mypage' },
  ];

  const menuBarContent = (
    <div
      className={`fixed top-0 left-0 pt-[20px] w-full bg-white shadow-md transition-transform duration-300 ease-in-out transform z-50 ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="relative p-[20px] pb-[28px]">
        <button className="absolute right-[20px]" onClick={onClose}>
          <Icon name="close-btn" />
        </button>

        <div className="flex flex-col gap-[20px] mt-[40px]">
          {menuItems.map((item, index) => (
            <div key={item.text}>
              <button
                className="flex items-center gap-[16px] w-full text-left"
                onClick={() => {
                  if (item.text === '로그아웃') {
                    handleLogoutWithClose();
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
              {index === 3 && (
                <div className="mt-[4px] pb-[20px] border-b-4 border-[#F4F6F8]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(menuBarContent, document.body);
};

export default MenuBar;

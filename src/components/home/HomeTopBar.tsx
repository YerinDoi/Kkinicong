import LogoTextIcon from '@/assets/svgs/logo/logo-text.svg?react';
import LogoIcon from '@/assets/svgs/logo/logo-icon.svg?react';
import MenuBar from '@/components/common/MenuBar';
import { useState, Fragment, useEffect } from 'react';
import AlarmIcon from '@/assets/icons/system/alarm.svg';
import { useNavigate } from 'react-router-dom';
import Icon from '@/assets/icons';

interface HomeTopBarProps {
  address?: string;
}

export default function HomeTopBar({ address = '' }: HomeTopBarProps) {
  // 메뉴 열림/닫힘 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 메뉴 열기/닫기 함수
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const login = () => {
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token); // accessToken 존재 여부로 로그인 상태 판단
  }, []);

  return (
    <Fragment>
      <div className="flex justify-between items-center py-[8px] px">
        {' '}
        {/* HomeTopBar의 주 내용 */}
        {/* 왼쪽 영역 : 로고, 지역구 */}
        <div className="flex pl-[16px] items-center gap-[4px]">
          <div className="flex items-center gap-1">
            <LogoTextIcon className="w-16" />
            <LogoIcon className="w-6 h-6" />
          </div>
          <span className="text-xs text-[#919191] font-normal">{address}</span>
        </div>
        {/* 오른쪽 영역 : 로그인 버튼, 메뉴버튼(햄버거) */}
        <div className="flex items-center gap-[14px]">
          {isLoggedIn ? (
            <button>
              <img src={AlarmIcon} className="w-[18px] h-[20px]" />
            </button>
          ) : (
            <button onClick={login} className="text-sm text-[#919191]">
              로그인하기
            </button>
          )}
          {/* 햄버거 버튼 클릭 시 toggleMenu 호출 */}
          <button onClick={toggleMenu}>
            {/* MenuIcon 대신 Icon name="menubar" 사용 (일관성 유지) */}
            <Icon name="menubar" className="w-6 h-6" />
          </button>
        </div>
      </div>
      {/* MenuBar 컴포넌트 렌더링, 상태 및 닫기 함수 전달 */}
      <MenuBar isOpen={isMenuOpen} onClose={closeMenu} />
    </Fragment>
  );
}

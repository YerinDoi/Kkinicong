import LogoTextIcon from '@/assets/svgs/logo/logo-text.svg?react';
import LogoIcon from '@/assets/svgs/logo/logo-icon.svg?react';
import DropdownIcon from '@/assets/icons/system/dropdown-light.svg?react';
import MenuBar from '@/components/common/MenuBar';
import { useState, Fragment } from 'react';
import Icon from '@/assets/icons';

export default function HomeTopBar() {
  // 메뉴 열림/닫힘 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 메뉴 열기/닫기 함수
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <Fragment>
      <div className="flex justify-between items-center h-12 py-[8px]">
        {' '}
        {/* HomeTopBar의 주 내용 */}
        {/* 왼쪽 영역 : 로고, 지역구 */}
        <div className="flex items-end gap-2 pl-[16px]">
          <div className="flex items-center gap-1">
            <LogoTextIcon className="w-16" />
            <LogoIcon className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600">인천 서구</span>
            <DropdownIcon />
          </div>
        </div>
        {/* 오른쪽 영역 : 로그인 버튼, 메뉴버튼(햄버거) */}
        <div className="flex items-center gap-2">
          <button className="text-sm text-[#919191]">로그인하기</button>
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

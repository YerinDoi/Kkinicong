import { useNavigate } from 'react-router-dom';
import Icon from '@/assets/icons';
import MenuBar from './MenuBar';
import { useState } from 'react';
import { Fragment } from 'react';

interface TopBarProps {
  title?: string; // 타이틀
  subTitle?: string; // 서브 타이틀
  rightType?: 'none' | 'menu' | 'custom'; // 오른쪽에 들어갈 요소, 세 가지 타입 지정
  customRightElement?: React.ReactNode; // ← 'custom'일 때만 사용됨
  showBackButton?: boolean; // 뒤로가기 버튼 표시 여부
  showHomeButton?: boolean;
  onBack?: () => void; // 뒤로가기 버튼 클릭 시 실행할 함수
  paddingX?: string;
  centerTitle?: boolean;
}

export default function TopBar({
  title,
  subTitle,
  rightType,
  customRightElement,
  showBackButton = true,
  paddingX = 'px-[20px]',
  showHomeButton = false,
  onBack,
  centerTitle = false,
}: TopBarProps) {
  const navigate = useNavigate();

  // 메뉴 열림/닫힘 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 메뉴 열기/닫기 함수
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <Fragment>
      <div className={`relative grid grid-cols-[auto_1fr_auto] items-center ${paddingX} py-[8px]`}>
        {/* 좌측: 뒤로/홈 */}
        <div className="flex items-center gap-[12px]">
          {showBackButton && (
            <button onClick={handleBack} className="py-[8px] pr-[12px]" aria-label="뒤로가기">
              <Icon name="backward" />
            </button>
          )}
          {showHomeButton && (
            <button onClick={() => navigate('/')} className="py-[8px]" aria-label="홈">
              <Icon name="home" />
            </button>
          )}
        </div>

        {/* 가운데 타이틀 */}
        {centerTitle ? (
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
            {title && (
              <span className="text-title-sb-button font-semibold text-black">
                {title}
              </span>
            )}
            {subTitle && (
              <div className="mt-[2px] text-[#919191] text-body-md-description leading-[18px]">
                {subTitle}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-baseline">
            {title && (
              <span className="text-title-sb-button font-semibold text-black">
                {title}
              </span>
            )}
            {subTitle && (
              <span className="ml-2 text-body-md-title font-medium text-[#919191]">
                {subTitle}
              </span>
            )}
          </div>
        )}

        {/* 우측: 메뉴/커스텀 */}
        <div className="flex items-center justify-end">
          {rightType === 'menu' && (
            <button className="w-[24px] h-[24px]" onClick={toggleMenu} aria-label="메뉴">
              <Icon name="menubar" />
            </button>
          )}
          {rightType === 'custom' && customRightElement}
        </div>
      </div>

      <MenuBar isOpen={isMenuOpen} onClose={closeMenu} />
    </Fragment>
  );
}

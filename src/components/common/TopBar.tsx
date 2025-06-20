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
  onBack?: () => void; // 뒤로가기 버튼 클릭 시 실행할 함수
  paddingX?: string;
}

export default function TopBar({
  title,
  subTitle,
  rightType,
  customRightElement,
  showBackButton = true,
  paddingX = 'px-[20px]',
  onBack,
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
      <div className={`flex items-center justify-between ${paddingX} py-[8px]`}>
        {/* 왼쪽 영역 : 뒤로가기버튼, 제목, 부제목 */}
        <div className="flex items-center gap-[4px]">
          {showBackButton ? (
            <button onClick={handleBack} className="py-[8px] pr-[12px]">
              <Icon name="backward" />
            </button>
          ) : (
            <div /> // 여백 맞춤
          )}
          {/* ) : (
          <div className="w-5 h-5" /> // 여백 맞춤
        )} */}

          {title && (
            <div className="flex items-baseline">
              <span className="text-[20px] font-semibold text-black">
                {title}
              </span>
              {subTitle && (
                <span className="ml-2 text-sm font-medium text-[#919191]">
                  {subTitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 오른쪽 영역 */}
        {rightType !== 'none' && (
          <div className="flex items-center ml-auto">
            {rightType === 'menu' && (
              <button
                className="w-[24px] h-[24px] aspect-square"
                onClick={toggleMenu}
              >
                <Icon name="menubar" />
              </button>
            )}

            {rightType === 'custom' && customRightElement}
          </div>
        )}
      </div>

      {/* MenuBar 컴포넌트 렌더링, 상태 및 닫기 함수 전달 */}
      <MenuBar isOpen={isMenuOpen} onClose={closeMenu} />
    </Fragment>
  );
}

import { useNavigate } from 'react-router-dom';
import BackIcon from '@/assets/icons/system/backward.svg?react';
import MenuIcon from '@/assets/icons/system/menu.svg?react';

interface TopBarProps {
  title?: string; // 타이틀
  subTitle?: string; // 서브 타이틀
  rightElement?: React.ReactNode; // 오른쪽 영역에 들어갈 요소
  showBackButton?: boolean; // 뒤로가기 버튼 표시 여부
  onBack?: () => void; // 뒤로가기 버튼 클릭 시 실행할 함수
}

export default function TopBar({
  title,
  subTitle,
  rightElement,
  showBackButton = true,
  onBack,
}: TopBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="flex items-center justify-between h-12">
      {/* 왼쪽 영역 : 뒤로가기버튼, 제목, 부제목 */}
      <div className="flex items-center">
        {showBackButton ? (
          <button onClick={handleBack} className="text-xl mr-2">
            <BackIcon className="h-[px15]" />
          </button>
        ) : (
          <div /> // 여백 맞춤
        )}
        {/* ) : (
          <div className="w-5 h-5" /> // 여백 맞춤
        )} */}

        {title && (
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-black">{title}</span>
            {subTitle && (
              <span className="ml-2 text-sm font-medium text-[#919191]">
                {subTitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 오른쪽 영역 : 메뉴버튼(햄버거) */}
      {rightElement && (
        <div className="flex items-center">
          <button>
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

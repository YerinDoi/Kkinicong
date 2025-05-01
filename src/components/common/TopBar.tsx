import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title?: string;
  subTitle?: string;
  rightElement?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
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
    <div className="flex items-center justify-between h-12 px-4">
      {/* 왼쪽 영역 */}
      <div className="flex items-center">
        {showBackButton ? (
          <button onClick={handleBack} className="text-xl mr-2">
            ←
          </button>
        ) : (
          <div className="w-6" /> // 여백 맞춤
        )}
        {title && (
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-black">{title}</span>
            {subTitle && (
              <span className="ml-1 text-sm text-gray-500">{subTitle}</span>
            )}
          </div>
        )}
      </div>

      {/* 오른쪽 영역 */}
      <div>{rightElement}</div>
    </div>
  );
}

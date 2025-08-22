import Icon from '../assets/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MenuBar from './common/MenuBar';

interface HeaderProps {
  title?: string;
  location?: string;
  showMenubarButton?: boolean;
  onBack?: () => void;
  className?: string;
}

const Header = ({
  title,
  location,
  showMenubarButton = true,
  onBack,
  className,
}: HeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <>
      <div
        className={`sticky top-0 z-[1000] font-pretendard grid grid-cols-[auto_1fr_auto] items-center w-full pt-[8px] pb-[8px] px-[20px] mb-[6px]${className ? ' ' + className : ''}`}
      >
        <div className="flex gap-[12px]">
          <button
            className="flex items-center pt-[8px] pb-[8px] pr-[12px]"
            onClick={handleBack}
          >
            <Icon name="backward" />
          </button>

          <button className="flex items-center" onClick={() => navigate('/')}>
            <Icon name="home" />
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <span className="justify-center text-black text-title-sb-button font-semibold">
            {title}
          </span>

          {location && (
            <span className="absolute top-full mt-[1.5px] text-[#919191] text-body-md-description font-regular leading-[18px]">
              {location}
            </span>
          )}
        </div>

        {showMenubarButton && (
          <button
            className="w-[24px] h-[24px] aspect-square ml-[24px]"
            onClick={toggleMenu}
          >
            <Icon name="menubar" />
          </button>
        )}
      </div>
      <MenuBar isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
};

export default Header;

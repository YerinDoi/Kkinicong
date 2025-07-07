import Icon from '../assets/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MenuBar from './common/MenuBar';

interface HeaderProps {
  title: string;
  location?: string;
  showMenubarButton?: boolean;
}

const Header = ({
  title,
  location,
  showMenubarButton = true,
}: HeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="font-pretendard flex items-center w-full pt-[8px] pb-[8px] px-[20px] mt-[11px]">
        <button
          className="flex items-center pt-[8px] pb-[8px] pr-[12px]"
          onClick={() => navigate('/')}
        >
          <Icon name="backward" />
        </button>

        <div className="flex items-center gap-[8px] ml-[4px]">
          <span className="text-black text-[20px] font-semibold leading-[32px]">
            {title}
          </span>

          {location && (
            <div className="flex items-center gap-[4px]">
              <span className="text-[#919191] text-[12px] font-normal leading-[18px]">
                {location}
              </span>
            </div>
          )}
        </div>

        {showMenubarButton && (
          <button
            className="w-[24px] h-[24px] aspect-square ml-auto"
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

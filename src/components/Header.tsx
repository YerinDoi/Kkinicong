import Icon from '../assets/icons';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  location?: string;
  showLocationDropdown?: boolean;
  showMenubarButton?: boolean;
}

const Header = ({
  title,
  location,
  showLocationDropdown = true,
  showMenubarButton = true,
}: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center w-full pt-[8px] pb-[8px] px-[20px]">
      <button
        className="flex items-center pt-[8px] pb-[8px] pr-[12px]"
        onClick={() => navigate('/')}
      >
        <Icon name="backward" />
      </button>

      <div className="flex items-end gap-[8px] ml-[4px]">
        <span className="text-black text-[20px] font-semibold leading-[32px]">
          {title}
        </span>

        {location && (
          <div className="flex items-center gap-[4px] mb-[2px]">
            <span className="text-[#919191] font-pretendard text-sm font-medium leading-[18px]">
              {location}
            </span>
            {showLocationDropdown && (
              <button>
                <Icon name="location-dropdown" />
              </button>
            )}
          </div>
        )}
      </div>

      {showMenubarButton && (
        <button className="w-[24px] h-[24px] aspect-square ml-auto">
          <Icon name="menubar" />
        </button>
      )}
    </div>
  );
};

export default Header;

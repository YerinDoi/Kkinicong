import Icon from '../assets/icons';

interface HeaderProps {
  title: string;
  location: string;
}

const Header = ({ title, location }: HeaderProps) => {
  return (
    <div className="flex items-center w-full pt-[8px] pb-[8px] px-[20px]">
      <button className="flex items-center pt-[8px] pb-[8px] pr-[12px]">
        <Icon name="backward" />
      </button>

      <div className="flex items-end gap-[8px] ml-[4px]">
        <span className="text-black text-[20px] font-semibold leading-[32px]">
          {title}
        </span>

        <div className="flex items-center gap-[4px]">
          <span className="text-[#919191] text-sm font-medium leading-[18px]">
            {location}
          </span>
          <button>
            <Icon name="location-dropdown" />
          </button>
        </div>
      </div>

      <button className="w-[24px] h-[24px] aspect-square ml-auto">
        <Icon name="menubar" />
      </button>
    </div>
  );
};

export default Header;

import Tag from '../common/Tag';

const convenienceStores = ['GS25', 'CU', '세븐일레븐', '이마트24', '미니스톱'];

const StoreChipCarousel = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (label: string) => void;
}) => {
  return (
    <div className="flex w-max gap-[8px] overflow-x-auto scrollbar-hide mb-[3px] ">
      {convenienceStores.map((label) => (
        <Tag
          key={label}
          label={label}
          selected={selected === label}
          onClick={() => onSelect(label)}
          className="h-[35px] flex-shrink-0 text-body-md-title"
        />
      ))}
    </div>
  );
};

export default StoreChipCarousel;

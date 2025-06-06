import React, { useState } from 'react';
import Tag from '../common/Tag';

const convenienceStores = ['GS25', 'CU', '세븐일레븐', '이마트24', '미니스톱'];

const StoreChipCarousel = ({ selected, onSelect }: { selected: string; onSelect: (label: string) => void }) => {
  return (
    <div className="flex w-max gap-[8px] overflow-x-auto scrollbar-hide ">
      {convenienceStores.map((label) => (
        <Tag
          key={label}
          label={label}
          selected={selected === label}
          onClick={() => onSelect(label)}
          className="h-[35px]"
        />
      ))}
    </div>
  );
};

export default StoreChipCarousel;

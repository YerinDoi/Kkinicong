import Backward from './system/backward.svg?react';
import Menubar from './system/menubar.svg?react';
import LocationDropdown from './system/locationDropdown.svg?react';
import Search from './system/search.svg?react';
import All from './menu/all.svg?react';
import Snack from './menu/snack.svg?react';
import Western from './menu/western.svg?react';
import Chinese from './menu/chinese.svg?react';
import Chicken from './menu/chicken.svg?react';
import Hotpot from './menu/hotpot.svg?react';
import Asian from './menu/asian.svg?react';
import Japanese from './menu/japanese.svg?react';
import Korean from './menu/korean.svg?react';
import StreetFood from './menu/streetFood.svg?react';
import LunchBox from './menu/lunchBox.svg?react';
import Etc from './menu/etc.svg?react';
import Dropdown from './system/dropdown.svg?react';
import Dropup from './system/dropup.svg?react';
import Star from './system/star.svg?react';
import Heart from './system/heart.svg?react';

export type IconName =
  | 'backward'
  | 'menubar'
  | 'locationDropdown'
  | 'search'
  | 'all'
  | 'snack'
  | 'western'
  | 'chinese'
  | 'chicken'
  | 'hotpot'
  | 'asian'
  | 'japanese'
  | 'korean'
  | 'streetFood'
  | 'lunchBox'
  | 'etc'
  | 'dropdown'
  | 'dropup'
  | 'star'
  | 'heart';

interface IconProps {
  name: IconName;
  className?: string;
}

const Icon = ({ name, className }: IconProps) => {
  if (name === 'backward') {
    return <Backward className={className} />;
  }

  if (name === 'menubar') {
    return <Menubar className={className} />;
  }

  if (name === 'locationDropdown') {
    return <LocationDropdown className={className} />;
  }

  if (name === 'search') {
    return <Search className={className} />;
  }

  if (name === 'all') {
    return <All className={className} />;
  }

  if (name === 'snack') {
    return <Snack className={className} />;
  }

  if (name === 'western') {
    return <Western className={className} />;
  }

  if (name === 'chinese') {
    return <Chinese className={className} />;
  }

  if (name === 'chicken') {
    return <Chicken className={className} />;
  }

  if (name === 'hotpot') {
    return <Hotpot className={className} />;
  }

  if (name === 'asian') {
    return <Asian className={className} />;
  }

  if (name === 'japanese') {
    return <Japanese className={className} />;
  }

  if (name === 'korean') {
    return <Korean className={className} />;
  }

  if (name === 'streetFood') {
    return <StreetFood className={className} />;
  }

  if (name === 'lunchBox') {
    return <LunchBox className={className} />;
  }

  if (name === 'etc') {
    return <Etc className={className} />;
  }

  if (name === 'dropdown') {
    return <Dropdown className={className} />;
  }

  if (name === 'dropup') {
    return <Dropup className={className} />;
  }

  if (name === 'star') {
    return <Star className={className} />;
  }

  if (name === 'heart') {
    return <Heart className={className} />;
  }
};
export default Icon;

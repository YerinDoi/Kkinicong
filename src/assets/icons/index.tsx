import Backward from './system/backward.svg?react';
import Menubar from './system/menubar.svg?react';
import LocationDropdown from './system/location-dropdown.svg?react';
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
import StreetFood from './menu/street-food.svg?react';
import LunchBox from './menu/lunch-box.svg?react';
import Etc from './menu/etc.svg?react';
import Dropdown from './system/dropdown.svg?react';
import Dropup from './system/dropup.svg?react';
import Star from './system/star.svg?react';
import Heart from './system/heart.svg?react';
import HeartFilled from './system/heart-filled.svg?react';
import Gps from './system/gps.svg?react';

import Login from './menubar/login.svg?react';
import Mypage from './menubar/mypage.svg?react';
import StoreMap from './menubar/store-map.svg?react';
import StoreSearch from './menubar/store-search.svg?react';
import Community from './menubar/community.svg?react';
import ConvenienceStore from './menubar/convenience-store.svg?react';
import CloseBtn from './menubar/close-btn.svg?react';
import Like from '@/assets/svgs/community/like.svg?react';
import LikeFilled from '@/assets/svgs/community/like-filled.svg?react';
import Edit from '@/assets/icons/system/edit.svg?react';
import Delete from '@/assets/icons/system/delete.svg?react';
import Report from '@/assets/svgs/common/report.svg?react';
import Comment from '@/assets/svgs/common/comment.svg?react';
import Send from '@/assets/svgs/community/send.svg?react';
import EditOrDelete from '@/assets/svgs/common/more-icon.svg?react';
import Reply from '@/assets/svgs/community/reply.svg?react';
import X from '@/assets/icons/system/x.svg?react';

export type IconName =
  | 'backward'
  | 'menubar'
  | 'location-dropdown'
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
  | 'street-food'
  | 'lunch-box'
  | 'etc'
  | 'dropdown'
  | 'dropup'
  | 'star'
  | 'heart'
  | 'heart-filled'
  | 'gps'
  | 'login'
  | 'mypage'
  | 'store-map'
  | 'store-search'
  | 'community'
  | 'convenience-store'
  | 'close-btn'
  | 'like'
  | 'like-filled'
  | 'edit'
  | 'delete'
  | 'report'
  | 'comment'
  | 'send'
  | 'edit-or-delete'
  | 'reply'
  | 'x';

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

  if (name === 'location-dropdown') {
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

  if (name === 'street-food') {
    return <StreetFood className={className} />;
  }

  if (name === 'lunch-box') {
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

  if (name === 'heart-filled') {
    return <HeartFilled className={className} />;
  }

  if (name === 'gps') {
    return <Gps className={className} />;
  }

  if (name === 'login') {
    return <Login className={className} />;
  }

  if (name === 'mypage') {
    return <Mypage className={className} />;
  }

  if (name === 'store-map') {
    return <StoreMap className={className} />;
  }

  if (name === 'store-search') {
    return <StoreSearch className={className} />;
  }

  if (name === 'community') {
    return <Community className={className} />;
  }

  if (name === 'convenience-store') {
    return <ConvenienceStore className={className} />;
  }

  if (name === 'close-btn') {
    return <CloseBtn className={className} />;
  }

  if (name === 'like') {
    return <Like className={className} />;
  }

  if (name === 'like-filled') {
    return <LikeFilled className={className} />;
  }

  if (name === 'edit') {
    return <Edit className={className} />;
  }

  if (name === 'delete') {
    return <Delete className={className} />;
  }

  if (name === 'report') {
    return <Report className={className} />;
  }

  if (name === 'comment') {
    return <Comment className={className} />;
  }

  if (name === 'send') {
    return <Send className={className} />;
  }

  if (name === 'edit-or-delete') {
    return <EditOrDelete className={className} />;
  }

  if (name === 'reply') {
    return <Reply className={className} />;
  }

  if (name === 'x') {
    return <X className={className} />;
  }
};

export default Icon;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuickActionButton from './QuickActionButton';
import StoreMapIcon from '@/assets/svgs/home/store-map.svg';
import StoreSearchIcon from '@/assets/svgs/home/store-search.svg';
import ConvenienceStoreIcon from '@/assets/svgs/home/convenience-store.svg';
import CommunityIcon from '@/assets/svgs/home/community.svg';

interface QuickActionItem {
  icon: string;
  text: string;
  onClick?: () => void;
  href?: string;
}

interface QuickActionButtonsProps {
  items?: QuickActionItem[];
}

const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({ items }) => {
  const navigate = useNavigate();

  const defaultItems: QuickActionItem[] = [
    {
      icon: StoreMapIcon,
      text: '가맹점지도',
      onClick: () => navigate('/store-map'),
    },
    {
      icon: StoreSearchIcon,
      text: '가맹점찾기',
      onClick: () => navigate('/store-search'),
    },
    {
      icon: ConvenienceStoreIcon,
      text: '편의점구매',
      onClick: () => navigate('/convenience'),
    },
    {
      icon: CommunityIcon,
      text: '커뮤니티',
      onClick: () => navigate('/community'),
    },
  ];

  const buttons = items || defaultItems;

  return (
    <div className="flex pt-[28px] pb-[16px] justify-center items-center gap-[32px] self-stretch">
      {buttons.map((item, index) => (
        <QuickActionButton
          key={index}
          icon={item.icon}
          text={item.text}
          onClick={item.onClick}
          href={item.href}
        />
      ))}
    </div>
  );
};

export default QuickActionButtons;

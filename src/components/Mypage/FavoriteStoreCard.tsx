import HomeIcon from '@/assets/icons/menu/all.svg';
import ChevromRightIcon from '@/assets/svgs/common/chevron-right.svg';

interface FavoriteStoreCardProps {
    count: number;
    onClick?: () => void;
}

const FavoriteStoreCard = ({ count, onClick }: FavoriteStoreCardProps) => (
  <button
    onClick={onClick}
    className="flex items-center w-full px-[20px] py-[16px] rounded-[16px] gap-[24px] border border-[#65CE58] bg-white self-stretch"
  >
    {/* 아이콘 */}
    <img src={HomeIcon} alt="찜한 가게" className="w-[66px] h-[55px] aspect-[6/5]" />

    {/* 텍스트 */}
    <div className="flex flex-col flex-1 items-start gap-[4px] font-pretendard">
      <span className="text-[16px] font-semibold leading-[20px] text-[#616161]">지금까지 찜한 가게 수</span>
      <span className="text-[20px] font-semibold leading-[28px] text-[#029F64]">{count}개</span>
    </div>

    {/* 화살표 */}
    <img src={ChevromRightIcon} className="flex-shrink-0"></img>
  </button>
);

export default FavoriteStoreCard;
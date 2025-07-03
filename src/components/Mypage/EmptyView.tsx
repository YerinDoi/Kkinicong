import CuriousCongG from '@/assets/svgs/logo/curious-congG.svg';
import plusIcon from '@/assets/svgs/common/plus-icon.svg';

interface EmptyViewProps {
  title: string;
  description?: string;
  actionText?: string;
  onActionClick?: () => void;
  actionType?: 'button' | 'link';
}

const EmptyView = ({
  title,
  description,
  actionText,
  onActionClick,
  actionType = 'link',
}: EmptyViewProps) => (
  <div className="flex flex-col items-center justify-center gap-[12px] text-center bg-[#F4F6F8]">
    <img
      src={CuriousCongG}
      className="w-[165px] h-[144px] pb-[8px]"
      style={{ aspectRatio: '55/48' }}
    />
    <div className="font-pretendard text-body-md-title font-normal whitespace-pre-line">
      {title}
    </div>
    {description && (
      <div className="text-sm text-gray-500 mb-4">{description}</div>
    )}
    {actionText && actionType === 'link' && (
      <button
        className="text-[#212121] text-center font-pretendard text-[12px] font-normal leading-[18px] tracking-[0.012px] underline decoration-solid underline-offset-auto decoration-from-font"
        style={{
          textDecorationThickness: 'auto',
          textUnderlinePosition: 'from-font',
        }}
        onClick={onActionClick}
      >
        {actionText}
      </button>
    )}
    {actionText && actionType === 'button' && (
      <button
        className="px-[20px] py-[12px] gap-[8px] bg-[#65CE58] font-pretendard text-white rounded-[24px] text-[16px] font-medium leading-normal tracking-[0.016px]"
        onClick={onActionClick}
      >
        <img src={plusIcon} className="w-[14px] h-[14px]" />
        {actionText}
      </button>
    )}
  </div>
);

export default EmptyView;

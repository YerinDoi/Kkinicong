import EmptyIcon from '@/assets/svgs/logo/curious-congG.svg';

export default function EmptyNotification() {
  return (
    <div className="flex flex-col justify-center items-center h-[70vh]">
      <img
        src={EmptyIcon}
        alt="알림 없음"
        className="w-[140px] h-[140px] mb-6"
      />
      <p className="text-[#666] text-[16px]">아직은 알림이 없어요</p>
    </div>
  );
}

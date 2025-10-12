import EmptyIcon from '@/assets/svgs/logo/curious-congG.svg';

export default function EmptyNotification() {
  return (
    <div className="flex flex-col flex-grow justify-center items-center bg-bg-gray">
      <img
        src={EmptyIcon}
        alt="알림 없음"
        className="w-[165px] h-[144px] mb-5"
      />
      <p className="text-[#666] text-body-md-title">아직은 알림이 없어요</p>
    </div>
  );
}

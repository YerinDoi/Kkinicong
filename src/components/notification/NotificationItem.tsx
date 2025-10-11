interface NotificationItemProps {
  content: string;
  createdAt: string;
  isRead: boolean;
  senderNickname: string;
  onClick: () => void;
}

export default function NotificationItem({
  content,
  createdAt,
  isRead,
  senderNickname,
  onClick,
}: NotificationItemProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer pt-2 pb-3 border-b-[1px] ${
        isRead ? 'bg-white' : 'bg-bg-gray'
      }`}
    >
      <p className="text-[12px] text-[#999] text-right mb-2 px-5 ">
        {createdAt}
      </p>
      <div className="flex items-baseline px-5 whitespace-nowrap">
        <span className="text-title-sb-button font-semibold text-text-gray">
          {senderNickname}
        </span>
        <p className="text-body-md-title text-main-gray font-regular">
          님이 {content}
        </p>
      </div>
    </div>
  );
}

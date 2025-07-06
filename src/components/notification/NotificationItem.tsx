interface NotificationItemProps {
  content: string;
  createdAt: string;
  isRead: boolean;
  onClick: () => void;
}

export default function NotificationItem({
  content,
  createdAt,
  isRead,
  onClick,
}: NotificationItemProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer py-2 border-b-[1px] ${
        isRead ? 'bg-white' : 'bg-[#F4F6F8]'
      }`}
    >
      <p className="text-[12px] text-[#999] text-right mb-2 px-5">
        {createdAt}
      </p>
      <p className="text-body-md-description px-5 text-[#919191] font-regular">
        {content}
      </p>
    </div>
  );
}

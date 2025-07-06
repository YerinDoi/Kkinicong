import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/common/TopBar';
import NotificationItem from '@/components/notification/NotificationItem';
import EmptyNotification from '@/components/notification/EmptyNotification';
import { useNotifications } from '@/hooks/useNotifications';
import { useMarkAsRead } from '@/hooks/useMarkAsRead';

export default function NotificationPage() {
  const { data, isLoading } = useNotifications();
  const { mutate } = useMarkAsRead();
  const navigate = useNavigate();

  const handleClick = (notification: any) => {
    if (!notification.isRead) {
      mutate(notification.notificationId);
    }
    navigate(notification.redirectUrl);
  };

  if (isLoading) return <div className="p-4">불러오는 중...</div>;

  return (
    <div className="min-h-screen">
      <TopBar title="알림" />
      {data && data.length === 0 ? (
        <EmptyNotification />
      ) : (
        <div className="py-3">
          {data?.map((n) => (
            <NotificationItem
              key={n.notificationId}
              content={n.content}
              isRead={n.isRead}
              createdAt={n.createdAt}
              onClick={() => handleClick(n)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

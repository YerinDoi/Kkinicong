import { useQuery } from '@tanstack/react-query';
import { fetchNotifications } from '@/api/notification';
import { Notification } from '@/types/notification';

/**
 * useNotifications 훅은 알림 목록을 가져오는 React Query 훅입니다.
 * @returns {Object} - 알림 목록과 로딩 상태를 포함하는 객체
 */

export const useNotifications = () => {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });
};

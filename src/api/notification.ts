import axios from '@/api/axiosInstance';
import { Notification } from '@/types/notification';

// 알림 목록 조회 API
export const fetchNotifications = async (): Promise<Notification[]> => {
  const res = await axios.get('/api/v1/notification');
  console.log('fetchNotifications', res.data.results.content);
  return res.data.results.content;
};

// 알림 읽음 처리 API
export const markAsRead = async (notificationId: number): Promise<void> => {
  await axios.patch(`/api/v1/notification/${notificationId}/read`);
};

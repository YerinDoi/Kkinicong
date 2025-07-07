export interface Notification {
  notificationId: number;
  type: string;
  content: string;
  redirectUrl: string;
  targetId: number;
  createdAt: string;
  isRead: boolean;
  senderNickname: string;
}

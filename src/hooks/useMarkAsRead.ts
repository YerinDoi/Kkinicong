import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAsRead } from '@/api/notification';
import { Notification } from '@/types/notification';

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries(['notifications']);
      const prev = queryClient.getQueryData<Notification[]>(['notifications']);

      queryClient.setQueryData(['notifications'], (old) =>
        old?.map((item) =>
          item.notificationId === notificationId
            ? { ...item, isRead: true }
            : item,
        ),
      );

      return { prev };
    },
    onError: (_err, _variables, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['notifications'], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });
};

import axiosInstance from '@/api/axiosInstance';
import { useCallback } from 'react';

const useCommentActions = (token: string, fetchPost: () => Promise<void>) => {
  const editComment = useCallback(async (commentId: number, content: string) => {
    if (!commentId || !content.trim()) return;

    try {
      const response = await axiosInstance.patch(
        `/api/v1/community/comment/${commentId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        alert('수정되었습니다!');
        await fetchPost();
        return true;
      } else {
        alert('수정 실패: ' + response.data.message);
      }
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      alert('오류 발생');
    }
    return false;
  }, [token, fetchPost]);

  const deleteComment = useCallback(async (commentId: number) => {
    try {
      const response = await axiosInstance.delete(
        `/api/v1/community/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data?.isSuccess) {
        alert('삭제되었습니다!');
        await fetchPost();
        return true;
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
    return false;
  }, [token, fetchPost]);

  return {
    editComment,
    deleteComment,
  };
};

export default useCommentActions;

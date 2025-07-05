import React, { useState } from 'react';
import Icon from '@/assets/icons';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  setRecentCommentId?: React.Dispatch<React.SetStateAction<number | null>>;
}

const MAX_LENGTH = 4000;

const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder,
  setRecentCommentId,
}) => {
  const { isLoggedIn } = useLoginStatus(); // 로그인 상태
  const [content, setContent] = useState('');
  const [isLoginBottomSheetOpen, setIsLoginBottomSheetOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setContent(e.target.value);
    }
  };

  const handleSubmit = async () => {
    if (content.trim()) {
      try {
        const newCommentId = await onSubmit(content); // ✅ 상위에서 댓글 등록 처리하고 commentId 반환
        console.log('✅ onSubmit 결과 commentId:', newCommentId);

        if (setRecentCommentId && typeof newCommentId === 'number') {
          console.log('✅ setRecentCommentId 호출 전:', newCommentId);
          setRecentCommentId(newCommentId); // ✅ 댓글 ID 저장
        }

        setContent('');
      } catch (err) {
        console.error('댓글 등록 중 오류:', err);
      }
    }
  };

  const handleRequireLoginClick = () => {
    console.log('로그인 필요합니다');
    setIsLoginBottomSheetOpen(true);
  };

  return (
    <div className="relative flex items-center mb-[12px] px-[16px] py-[10px] border border-[#C3C3C3] rounded-[12px] text-[#919191] text-[12px]">
      <textarea
        value={content}
        onChange={handleInputChange}
        placeholder={
          placeholder ??
          (isLoggedIn ? '댓글을 남겨보세요' : '로그인하고 댓글을 남겨보세요')
        }
        spellCheck={false}
        rows={1}
        className="flex-1 resize-none max-h-[80px] border-none outline-none bg-transparent text-black placeholder:text-[#C3C3C3]"
      />

      {!isLoggedIn && (
        <div
          onClick={handleRequireLoginClick}
          className="absolute top-0 left-0 w-full h-full cursor-pointer z-10"
        />
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isLoggedIn || !content.trim()}
        className="ml-[10px] disabled:opacity-50 z-20"
      >
        <Icon name="send" />
      </button>

      <LoginRequiredBottomSheet
        isOpen={isLoginBottomSheetOpen}
        onClose={() => setIsLoginBottomSheetOpen(false)}
      />
    </div>
  );
};

export default CommentInput;

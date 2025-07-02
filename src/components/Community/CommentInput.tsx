import React, { useEffect, useState } from 'react';
import Icon from '@/assets/icons';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';

interface CommentInputProps {
  onSubmit: (comment: string) => void;
}

const MAX_LENGTH = 4000;

const CommentInput: React.FC<CommentInputProps> = ({ onSubmit }) => {
  const { isLoggedIn } = useLoginStatus(); // 로그인 상태
  const [comment, setComment] = useState('');
  const [isLoginBottomSheetOpen, setIsLoginBottomSheetOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setComment(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  const handleRequireLoginClick = () => {
    console.log('로그인 필요합니다');
    setIsLoginBottomSheetOpen(true);
  };

  return (
    <div className="relative flex h-[50px] items-center border border-[#C3C3C3] rounded-[12px] p-[16px] text-[#919191] font-regular text-[12px]">
      <textarea
        value={comment}
        onChange={handleInputChange}
        placeholder={
          isLoggedIn ? '댓글을 남겨보세요' : '로그인하고 댓글을 남겨보세요'
        }
        spellCheck={false}
        rows={1}
        className="flex-1 h-full resize-none scrollbar-hide border-none outline-none bg-transparent text-black placeholder:text-[#C3C3C3]"
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
        disabled={!isLoggedIn || !comment.trim()}
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

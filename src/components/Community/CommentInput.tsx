import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/assets/icons';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';
import { useParams } from 'react-router-dom';

interface CommentInputProps {
  onSubmit: (content: string) => void | Promise<number | void>;
  placeholder?: string;
  setRecentCommentId?: React.Dispatch<React.SetStateAction<number | null>>;
  defaultValue?: string;
  postId?: number;
}

const MAX_LENGTH = 4000;

const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder,
  setRecentCommentId,
  defaultValue,
}) => {
  const { isLoggedIn } = useLoginStatus();
  const [content, setContent] = useState(defaultValue ?? '');
  const [isLoginBottomSheetOpen, setIsLoginBottomSheetOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const { postId } = useParams();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // defaultValue가 바뀌면 content 초기화
  useEffect(() => {
    setContent(defaultValue ?? '');
  }, [defaultValue]);

  // 높이 자동조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 줄어드는 경우 반영
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setContent(e.target.value);
    }
  };

  const handleSubmit = async () => {
    if (content.trim()) {
      try {
        const newCommentId = await onSubmit(content);
        if (setRecentCommentId && typeof newCommentId === 'number') {
          setRecentCommentId(newCommentId);
        }
        setContent(''); // 전송 후 초기화
      } catch (err) {
        console.error('댓글 등록 중 오류:', err);
      }
    }
  };

  const handleRequireLoginClick = () => {
    if (postId) {
      setPendingPath(`/community/post/${postId}`);
    }
    setIsLoginBottomSheetOpen(true);
  };

  return (
    <div className="relative flex items-center mb-[12px] px-[16px] py-[10px] border border-[#C3C3C3] rounded-[12px] text-[#919191] text-[12px]">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleInputChange}
        placeholder={
          placeholder ??
          (isLoggedIn ? '댓글을 남겨보세요' : '로그인하고 댓글을 남겨보세요')
        }
        spellCheck={false}
        rows={1}
        className="flex-1 resize-none overflow-hidden border-none outline-none bg-transparent text-black placeholder:text-[#C3C3C3]"
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
        pendingPath={pendingPath}
      />
    </div>
  );
};

export default CommentInput;

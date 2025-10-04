import React, { useState, useRef, useEffect } from 'react';
import ProfileImg from '@/assets/svgs/common/profile-img.svg';
import Icon from '@/assets/icons';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';
import axiosInstance from '@/api/axiosInstance';
import CommentInput from '@/components/Community/CommentInput';
import ReplyItem from '@/components/Community/ReplyItem';
import { createPortal } from 'react-dom';
import CommunityReportButton from '@/components/Community/ReportButton';
import EditOrDeleteButton from '@/components/Community/EditOrDeleteButton';
import useCommentActions from '@/hooks/useCommentActions';
import ConfirmModal from '../common/ConfirmModal';
import ConfirmToast from '../common/ConfirmToast';

export interface CommentData {
  commentId: number;
  content: string;
  nickname: string | null;
  createdAt: string;
  isModified: boolean;
  isMyComment: boolean;
  isAuthor: boolean;
  isLiked: boolean;
  likeCount: number;
  replyListResponse: CommentData[];
}

interface CommentItemProps {
  data: CommentData;
  postId: number;
  isReply?: boolean;
  onReload: () => Promise<void>;
  setIsReplying?: (value: boolean) => void; //답글 작성 중에는 댓글창 없애려고
  setRecentCommentId?: React.Dispatch<React.SetStateAction<number | null>>;
  recentCommentId?: number | null;
  parentNickname?: string;
  setIsEditing?: (value: boolean) => void;
  setEditingCommentId?: (id: number) => void;
  setEditingContent?: (content: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  data,
  isReply = false,
  onReload,
  postId,
  setIsReplying,
  recentCommentId,
  setRecentCommentId,
  parentNickname,
  setIsEditing,
  setEditingCommentId,
  setEditingContent,
}) => {
  const {
    commentId,
    content,
    nickname,
    createdAt,
    isAuthor,
    likeCount,
    replyListResponse,
    isLiked: initialIsLiked,
    isModified,
    isMyComment,
  } = data;
  const { isLoggedIn } = useLoginStatus();
  const [isLoginBottomSheetOpen, setIsLoginBottomSheetOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const token = localStorage.getItem('accessToken');
  const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const [replyTargetNickname, setReplyTargetNickname] = useState<string | null>(
    null,
  );
  //답글 수정용
  const [isReplyEditing, setIsReplyEditing] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingReplyContent, setEditingReplyContent] = useState<string>('');
  const { editComment, deleteComment } = useCommentActions(token!, onReload);
  //답글 달때 스크롤 위치 저장
  const previousScrollY = useRef<number>(0);
  const commentRef = useRef<HTMLDivElement>(null);

  // 새로 등록된 댓글/답글 구별
  const isNew = recentCommentId === commentId;
  //신고,삭제된 경우
  const isHiddenComment =
    content === '신고된 댓글입니다' || content === '삭제된 댓글입니다';
  //댓글, 답글 삭제 모달
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  //댓글,답글 삭제 토스트
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  //좋아요
  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      if (postId) {
        console.log('postId', postId);
        setPendingPath(`/community/post/${postId}`);
      }
      setIsLoginBottomSheetOpen(true);
      return;
    }

    if (!commentId) {
      console.error('[좋아요 실패] undefined입니다.');
      return;
    }

    try {
      const response = await axiosInstance({
        method: 'post',
        url: `/api/v1/community/comment/${commentId}/like`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.isSuccess) {
        setIsLiked(response.data.results.isLiked);
        setLocalLikeCount(response.data.results.likeCount);
      } else {
        console.error('서버 응답 실패:', response.data.message);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
    }
  };

  //답글시 키보드가 올라올 때 스크롤해 보이게하기
  useEffect(() => {
    const input = document.querySelector('input');
    const onFocus = () => {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight); // 키보드 위로 보이게
      }, 100);
    };
    input?.addEventListener('focus', onFocus);
    return () => input?.removeEventListener('focus', onFocus);
  }, []);

  //답글달기 버튼 클릭

  const handleReplyClick = () => {
    if (!isLoggedIn) {
      if (postId) {
        setPendingPath(`/community/post/${postId}`);
      }
      setIsLoginBottomSheetOpen(true);
      return;
    }
    const fallback = nickname?.trim() ? nickname : '익명';

    setReplyTargetNickname(fallback);
    setIsReplying?.(true);
    setIsReplyInputOpen(true);
    previousScrollY.current = window.scrollY;

    // 댓글 요소로 스크롤 이동
    setTimeout(() => {
      commentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  //답글 입력창 닫기
  const handlecloseReplyInput = () => {
    setIsReplying?.(false);
    setIsReplyInputOpen(false);
    setReplyTargetNickname(null);
    setIsReplyEditing(false);
    setEditingReplyId(null);
    setEditingReplyContent('');
  };

  useEffect(() => {
    if (isReplyInputOpen && replyInputRef.current) {
      replyInputRef.current.focus(); // 모바일 키보드 올라옴
    }
  }, [isReplyInputOpen]);

  //답글전송 함수
  const handleReplySubmit = async (content: string) => {
    if (!content.trim()) return;

    try {
      setIsReplying?.(false);
      const response = await axiosInstance.post(
        `/api/v1/community/post/${postId}/comment/${commentId}/reply`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.isSuccess) {
        const newCommentId = response.data.results.id;
        console.log('답글Id', newCommentId);
        setRecentCommentId?.(newCommentId);
        handlecloseReplyInput();

        await onReload?.(); // 상위에서 댓글 다시 불러오게 하기

        // 원래 스크롤 위치로 복귀
        setTimeout(() => {
          window.scrollTo({ top: previousScrollY.current, behavior: 'smooth' });
        }, 100);

        return newCommentId; // 이걸로 newCommentId 지정
      } else {
        console.error('대댓글 등록 실패:', response.data.message);
      }
    } catch (error) {
      console.error('대댓글 등록 에러:', error);
    }
  };

  //댓글 수정하기 버튼
  const handleCommentEdit = () => {
    if (!isReply) {
      setIsEditing?.(true);
      setEditingCommentId?.(commentId);
      setEditingContent?.(content);
    } else {
      // 답글은 기존 방식 유지
      handleReplyEdit();
    }
  };

  //답글 수정하기 버튼
  const handleReplyEdit = () => {
    const fallback = parentNickname?.trim() ? parentNickname : '익명';

    setReplyTargetNickname(fallback);
    setIsReplyEditing(true);
    setEditingReplyId(commentId);
    setEditingReplyContent(content); // 원래 댓글 내용 입력
    setIsReplyInputOpen(true); // input 열기
  };

  //답글 수정 후 전송
  const handleEditSubmit = async (newContent: string) => {
    if (!editingReplyId || !newContent.trim()) return;

    const success = await editComment(editingReplyId, newContent);
    if (success) {
      handlecloseReplyInput();
      onReload?.();
    } else {
      alert('수정 실패!');
    }
  };
  //댓글 삭제
  const handleCommentDelete = async () => {
    const success = await deleteComment(commentId);
    if (success) {
      setShowDeleteToast(true);
      setTimeout(() => setShowDeleteToast(false), 1500);
    } else {
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div ref={commentRef}>
      <div
        className={`
    ${isReply ? 'pl-0 pr-[20px] border-none pt-0' : `px-[20px] pt-[12px]`}
    pb-[12px] border-b-[1.5px] border-disabled
    ${isNew ? 'bg-bg-gray' : ''}
  `}
      >
        {/* 상단: 프로필 + 닉네임/작성자/시간 + more 아이콘 */}
        <div className="flex justify-between items-center">
          {/* 왼쪽: 프로필 + 텍스트 */}
          <div className="flex gap-[8px] items-center">
            <img
              src={ProfileImg}
              alt="프로필사진"
              className="w-[40px] h-[40px] rounded-full"
            />
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-[8px]">
                <span className="text-black body-md-title">
                  {nickname ?? '익명'}
                </span>

                {isAuthor && (
                  <span className="px-[8px] py-[2px] text-body-md-description font-regular rounded-[8px] bg-disabled text-text-gray">
                    작성자
                  </span>
                )}

                <span className="text-main-gray text-[12px]">
                  {isModified && '수정됨 · '}
                  {createdAt}
                </span>
              </div>
            </div>
          </div>

          {/* 오른쪽: 더보기/신고하기 아이콘 */}
          {!isHiddenComment &&
            (isMyComment ? (
              <EditOrDeleteButton
                onEdit={handleCommentEdit}
                onDelete={() => setIsConfirmOpen(true)}
              />
            ) : (
              <CommunityReportButton
                type="comment"
                id={commentId}
                postId={postId}
                info={{ nickname: nickname ?? '익명', content }}
              />
            ))}
        </div>
        <div className="text-text-gray font-regular text-body-md-title pl-[48px] whitespace-pre-wrap break-words">
          {content}
        </div>

        {/* 하단: 답글쓰기 + 좋아요 */}
        {!isHiddenComment && (
          <div
            className={`${isReply ? 'justify-end' : 'justify-between'} flex items-center mt-[12px] pl-[48px]`}
          >
            <div
              onClick={handleReplyClick}
              className={
                isReply
                  ? 'hidden '
                  : 'cursor-pointer text-black font-regular text-body-md-title '
              }
            >
              답글쓰기
            </div>
            <div
              className={`flex gap-[4px] text-title-sb-button items-center font-bold font-semibold ${
                isLiked ? 'text-main-color' : 'text-sub-gray'
              }`}
            >
              <button onClick={handleLikeClick} className="cursor-pointer">
                <Icon
                  name={isLiked ? 'heart-filled' : 'heart'}
                  className="w-[16px]"
                />
              </button>
              {localLikeCount}
            </div>
          </div>
        )}
      </div>

      {/* 대댓글 렌더링 */}
      {!isReply && replyListResponse?.length > 0 && (
        <div className="flex flex-col">
          {replyListResponse.map((reply) => (
            <ReplyItem
              key={reply.commentId}
              data={reply}
              postId={postId}
              parentNickname={nickname ?? '익명'}
              onReload={onReload}
              isNew={recentCommentId === reply.commentId}
            />
          ))}
        </div>
      )}

      {/*답글*/}
      {isReplyInputOpen &&
        createPortal(
          <div className="fixed bottom-0 w-full z-50 bg-white border-t shadow-lg">
            <div className="pl-[20px] pr-[22px] py-[9px] bg-bg-gray font-regular text-body-md-description text-main-gray">
              <span className="text-text-gray">
                {replyTargetNickname || '[없음]'}
              </span>
              님에게 답글 남기는 중
              <button
                onClick={handlecloseReplyInput}
                className="float-right text-text-gray"
              >
                ✕
              </button>
            </div>
            <div className="px-[20px] mt-[12px]">
              <CommentInput
                onSubmit={isReplyEditing ? handleEditSubmit : handleReplySubmit}
                placeholder={
                  isReplyEditing ? '답글을 수정하세요' : '답글을 남겨보세요'
                }
                defaultValue={editingReplyContent} // input에 미리 채워 넣을 값
                setRecentCommentId={setRecentCommentId}
              />
            </div>
          </div>,
          document.body, // Portal로 body에 직접 렌더링
        )}

      <LoginRequiredBottomSheet
        isOpen={isLoginBottomSheetOpen}
        onClose={() => setIsLoginBottomSheetOpen(false)}
        pendingPath={pendingPath}
      />

      {isConfirmOpen && (
        <ConfirmModal
          title={isReply ? '답글을 삭제하시겠어요?' : '댓글을 삭제하시겠어요?'}
          onClose={() => setIsConfirmOpen(false)}
          onDelete={() => {
            setIsConfirmOpen(false);
            handleCommentDelete(); // 실제 삭제 실행
          }}
        />
      )}

      {showDeleteToast &&
        createPortal(
          <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
            <ConfirmToast
              text={
                isReply
                  ? '답글 삭제가 완료되었어요'
                  : '댓글 삭제가 완료되었어요'
              }
            />
          </div>,
          document.body,
        )}
    </div>
  );
};

export default CommentItem;

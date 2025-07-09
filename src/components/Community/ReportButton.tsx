import React, { useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import BottomSheetForm from '@/components/common/BottomSheetForm';
import ConfirmToast from '@/components/common/ConfirmToast';
import WarningToast from '@/components/common/WarningToast';
import { createPortal } from 'react-dom';
import AlarmIcon from '@/assets/svgs/common/report.svg';
import axiosInstance from '@/api/axiosInstance';
import axios from 'axios';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';
import { useLoginStatus } from '@/hooks/useLoginStatus';

interface ReportButtonProps {
  type: 'post' | 'comment';
  id: number;
  info: {
    nickname: string;
    content: string;
  };
  onClick?: () => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  type,
  id,
  info,
  onClick,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const { isLoggedIn } = useLoginStatus();
  const [isLoginBottomSheetOpen, setIsLoginBottomSheetOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const reasonMap = {
    '부적절한 언어 사용 (욕설, 비방 등)': 'ABUSIVE_LANGUAGE',
    '허위 정보 제공': 'FAKE_INFO',
    '개인정보 노출': 'PRIVACY',
    '스팸홍보/도배': 'SPAM',
    기타: 'ETC',
  } as const;

  const handleClick = () => {
    if (!isLoggedIn) {
      setPendingPath(`/community/post/${id}`);
      setIsLoginBottomSheetOpen(true);
      return;
    }
    onClick?.();
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (reason: string, description: string) => {
    const token = localStorage.getItem('accessToken');
    const mappedReason = reasonMap[reason as keyof typeof reasonMap];

    if (!mappedReason) {
      alert('신고 사유가 유효하지 않습니다.');
      return;
    }
    const url =
      type === 'post'
        ? `/api/v1/report/community/post/${id}`
        : `/api/v1/report/community/comment/${id}`;

    try {
      await axiosInstance.post(
        url,
        {
          description: mappedReason === 'ETC' ? description : null,
        },
        {
          params: { reason: mappedReason },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('신고 전송됨');
      setIsEditOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorCode = error.response?.data?.code;
        console.error('신고 실패 코드:', errorCode);

        if (errorCode === 'REPORT_ALREADY_EXISTS') {
          setIsEditOpen(false);
          setShowWarningToast(true);
          setTimeout(() => setShowWarningToast(false), 3000);
          return;
        }

        alert('신고에 실패했습니다.');
      } else {
        alert('예상치 못한 오류가 발생했습니다.');
      }
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="text-body-md-description font-regular text-[#919191] flex gap-[4px]"
      >
        <img src={AlarmIcon} className="h-[14px]" />
        <p>신고하기</p>
      </button>

      <BottomSheet isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <BottomSheetForm
          title="커뮤니티 글 신고하기"
          radioOptions={[
            '부적절한 언어 사용 (욕설, 비방 등)',
            '허위 정보 제공',
            '개인정보 노출',
            '스팸홍보/도배',
            '기타',
          ]}
          question="어떤 문제가 있나요?"
          buttonText="신고하기"
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditOpen(false)}
          postInfo={type === 'post' ? info : undefined}
          commentInfo={type === 'comment' ? info : undefined}
        />
      </BottomSheet>

      {showToast &&
        createPortal(
          <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
            <ConfirmToast
              text={['신고 완료!', '최대한 빠르게 확인하고 반영할게요']}
            />
          </div>,
          document.body,
        )}

      {showWarningToast &&
        createPortal(
          <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
            <WarningToast
              text={[
                '이미 신고 완료된 콘텐츠에요',
                '빠르게 검토중이니 잠시 기다려주세요',
              ]}
            />
          </div>,
          document.body,
        )}
      <LoginRequiredBottomSheet
        isOpen={isLoginBottomSheetOpen}
        onClose={() => setIsLoginBottomSheetOpen(false)}
        pendingPath={pendingPath}
      />
    </>
  );
};

export default ReportButton;

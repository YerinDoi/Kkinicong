import React, { useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import BottomSheetForm from '@/components/common/BottomSheetForm';
import ConfirmToast from '@/components/common/ConfirmToast';
import axiosInstance from '@/api/axiosInstance';
import axios from 'axios';
import { createPortal } from 'react-dom';
import WarningToast from '@/components/common/WarningToast';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';

interface Props {
  storeId: number;
  onClick?: () => void;
  storeInfo?: {
    name: string;
    category?: string;
    mapComponent?: React.ReactNode;
  };
}

const RequestEditButton: React.FC<Props> = ({
  storeId,
  onClick,
  storeInfo,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const { isLoggedIn } = useLoginStatus();
  const [isLoginBottomSheetOpen, setIsLoginBottomSheetOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  
  const reasonMap = {
    '음식 카테고리': 'CATEGORY',
    위치: 'LOCATION',
    영업시간: 'BUSINESS_HOURS',
    '폐업한 가게': 'CLOSED',
    기타: 'ETC',
  } as const;

  const handleClick = () => {
    if (!isLoggedIn) {
      setPendingPath(`/store/${storeId}`);
      setIsLoginBottomSheetOpen(true);
      return;
    }
    onClick?.();
    setIsEditOpen(true); // 바텀시트 열기
  };

  const handleEditSubmit = async (reason: string, description: string) => {
    const token = localStorage.getItem('accessToken');
    const mappedReason = reasonMap[reason as keyof typeof reasonMap];

    try {
      await axiosInstance.post(
        `/api/v1/report/store/${storeId}`,
        { description },
        {
          params: { reason: mappedReason },
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log('수정 요청 전송됨');
      setIsEditOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorCode = error.response?.data?.code;
        console.error('수정 요청 실패 코드:', errorCode);

        if (errorCode === 'STORE_REPORT_ALREADY_EXISTS') {
          setIsEditOpen(false);
          setShowWarningToast(true);

          setTimeout(() => setShowWarningToast(false), 1500); // 3초 뒤 자동 닫힘
          return;
        }

        alert('수정 요청에 실패했습니다.');
      } else {
        alert('예상치 못한 오류가 발생했습니다.');
      }
    }
  };

  const handleCloseClick = () => {
    console.log('모달 닫힘');
    setIsEditOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center h-[24px] bg-[#F4F6F8] text-black-500 border-[1px] border-[#919191] text-body-md-description px-[12px] py-[6px] rounded-[23px]"
      >
        가게 수정 요청하기
      </button>

      <BottomSheet isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <BottomSheetForm
          title="가게 정보 수정 요청하기"
          radioOptions={[
            '음식 카테고리',
            '위치',
            '영업시간',
            '폐업한 가게',
            '기타',
          ]}
          question="어떤 정보가 잘못되었나요?"
          buttonText="수정 요청하기"
          onSubmit={handleEditSubmit}
          onCancel={handleCloseClick}
          storeInfo={storeInfo}
        />
      </BottomSheet>
      {showToast &&
        createPortal(
          <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
            <ConfirmToast
              text={['수정 요청 완료!', '최대한 빠르게 확인하고 반영할게요']}
            />
          </div>,
          document.body,
        )}
      {showWarningToast &&
        createPortal(
          <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
            <WarningToast
              text={[
                '동일 가게에 대한 정보 수정 요청은',
                '요청 이후 7일 뒤 가능해요',
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

export default RequestEditButton;

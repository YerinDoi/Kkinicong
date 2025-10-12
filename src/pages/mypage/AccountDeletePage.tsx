import TopBar from '@/components/common/TopBar';
import { useState } from 'react';
import CheckboxIcon from '@/assets/svgs/review/checkbox.svg';
import UncheckedIcon from '@/assets/svgs/review/unchecked-box.svg';
import GreenButton from '@/components/common/GreenButton';
import Modal from '@/components/common/Modal';
import useWithdraw from '@/hooks/useWithdraw';
import { useNavigate } from 'react-router-dom';
import ConfirmToast from '@/components/common/ConfirmToast';

const AccountDeletePage = () => {
  const [checked, setChecked] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleWithdraw = useWithdraw();
  const navigate = useNavigate();

  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <TopBar
        title="회원 탈퇴"
        rightType="none"
        onBack={() => navigate('/mypage')}
      />
      <div className="px-[20px] font-pretendard text-[16px] font-semibold leading-[20px]">
        <div className="flex flex-col h-[44px] justify-between mt-[24px]">
          <p>끼니콩 탈퇴를 신청하기 전에</p>
          <p className="text-main-color">안내 사항을 확인해주세요</p>
        </div>

        <div className="flex flex-col px-[8px] gap-[24px]">
          <div className="flex flex-col self-stretch text-text-gray gap-[8px] mt-[44px]">
            <p className="font-semibold">탈퇴 처리 안내</p>
            <ul className="list-disc pl-4 text-[14px] leading-[24px] font-normal text-justify">
              <li>
                탈퇴한 아이디는 본인과 타인 모두{' '}
                <span className="text-sub-color">재사용 및 복구가 불가</span>
                하오니 신중하게 선택하시기 바랍니다.
              </li>
              <li>
                탈퇴 후{' '}
                <span className="text-sub-color">회원정보는 모두 삭제</span>
                됩니다.
              </li>
            </ul>
          </div>

          <div className="flex flex-col self-stretch text-text-gray text-[14px] gap-[8px] w-full">
            <p className="text-[16px] leading-[20px] font-semibold">개인정보 삭제 안내</p>
            <p className="text-text-gray self-stretch whitespace-normal leading-[24px] font-normal text-justify">
              탈퇴 후에도{' '}
              <span className="text-sub-color">등록한 게시물은 그대로</span>{' '}
              남아 있습니다. [편의점 정보 공유 게시판]과 [커뮤니티]에 올린
              게시글 및 댓글은 탈퇴 시 자동 삭제되지 않고 그대로 남아 있으며,
              작성자 정보는 비식별화 처리됩니다. 삭제를 원하는 게시글이 있다면
              반드시{' '}
              <span className="text-sub-color">
                탈퇴 전 비공개 처리하거나 삭제
              </span>
              하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-auto justify-center gap-[43px]">
        <div className="flex justify-center">
          <label className="flex items-center gap-[8px] cursor-pointer select-none">
            <div onClick={handleToggle} className="w-[20px] h-[20px]">
              <img
                src={checked ? CheckboxIcon : UncheckedIcon}
                alt="체크박스"
                className="w-full h-full"
              />
            </div>

            <span
              className={
                'text-title-sb-button font-semibold ' +
                (checked ? 'text-text-gray' : 'text-main-gray')
              }
            >
              위 사항을 모두 확인하였으며, 이에 동의합니다.
            </span>
          </label>
        </div>

        <div className="flex mt-auto mb-[68px] justify-center">
          <GreenButton
            text="끼니콩 탈퇴하기"
            onClick={() => setOpenModal(true)}
            disabled={!checked}
          />
        </div>
      </div>

      {/* 탈퇴 확인 모달 */}
      <Modal
        open={openModal}
        title="정말 탈퇴 하시겠어요?"
        confirmText="탈퇴하기"
        cancelText="취소"
        onConfirm={async () => {
          await handleWithdraw();
          setOpenModal(false)
          setShowToast(true);
          setTimeout(() => {
            navigate('/');
          }, 1500);
        }}
        onCancel={() => setOpenModal(false)}
      />

      {/* 탈퇴 완료 토스트 */}
      {showToast && (
        <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-[9999]">
          <ConfirmToast text="회원 탈퇴가 완료되었어요" />
        </div>
      )}
    </div>
  );
};

export default AccountDeletePage;

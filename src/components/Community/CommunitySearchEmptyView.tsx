import EmptyView from "../Mypage/EmptyView"
import { useNavigate } from "react-router-dom"
import { useLoginStatus } from "@/hooks/useLoginStatus";
import LoginRequiredBottomSheet from "../common/LoginRequiredBottomSheet";
import { useState } from 'react';
import plusIcon from '@/assets/svgs/common/plus-icon.svg';

interface CommunitySearchEmptyViewProps {
  keyword:string;
  
}

const CommunitySearchEmptyView = ({keyword}:CommunitySearchEmptyViewProps) => {
  const navigate = useNavigate();
  const { isLoggedIn} = useLoginStatus();
  const [LoginSheetOpen, setLoginSheetOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handleClick = () => {

    if (isLoggedIn) {
      navigate('/community/write');
    } else {
      setPendingPath('/community/write');
      setLoginSheetOpen(true);
    }
  };
  return (
  <div className="min-h-screen flex flex-col">
    <div className="flex flex-col gap-[20px] w-full flex-1 items-center pt-[165px] bg-bg-gray">
      <EmptyView
        title={
          <span>
            <span className="text-[#212121]">'{keyword}'</span>
            <span className="text-main-gray">와 관련한 검색 결과가 없어요</span>
          </span>
        }
        actionType="text"
        actionText="나누고 싶은 이야기가 있다면, \n첫 글을 남겨주세요!"
      />
      <button
        className="flex items-center justify-center px-[20px] py-[12px] gap-[8px] bg-main-color text-white font-pretendard rounded-[24px] text-[16px] font-medium leading-normal tracking-[0.016px]"
        onClick={handleClick}
      >
        <img src={plusIcon} />
        글쓰기
      </button>
    </div>

    <LoginRequiredBottomSheet
      isOpen={LoginSheetOpen}
      onClose={() => setLoginSheetOpen(false)}
      pendingPath = {pendingPath}
    />
  </div>
);

}

export default CommunitySearchEmptyView;
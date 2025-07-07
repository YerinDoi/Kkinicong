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

  const handleClick = () => {

    if (isLoggedIn) {
      navigate('/community/write');
    } else {
      setLoginSheetOpen(true);
    }
  };
  return (
  <div className="min-h-screen flex flex-col">
    <div className="flex flex-col gap-[20px] w-full flex-1 items-center pt-[165px] bg-[#F4F6F8]">
      <EmptyView
        title={
          <span>
            <span className="text-[#212121]">'{keyword}'</span>
            <span className="text-[#919191]">와 관련한 검색 결과가 없어요</span>
          </span>
        }
        actionType="text"
        actionText="나누고 싶은 이야기가 있다면, \n첫 글을 남겨주세요!"
      />
      <button
        className="flex items-center justify-center px-[20px] py-[12px] gap-[8px] bg-[#65CE58] text-white font-pretendard rounded-[24px] text-[16px] font-medium leading-normal tracking-[0.016px]"
        onClick={handleClick}
      >
        <img src={plusIcon} />
        글쓰기
      </button>
    </div>

    <LoginRequiredBottomSheet
      isOpen={LoginSheetOpen}
      onClose={() => setLoginSheetOpen(false)}
    />
  </div>
);

}

export default CommunitySearchEmptyView;
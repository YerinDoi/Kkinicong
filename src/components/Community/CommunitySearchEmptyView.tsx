import EmptyView from "../Mypage/EmptyView"
import { useNavigate } from "react-router-dom"
import { useLoginStatus } from "@/hooks/useLoginStatus";
import LoginRequiredBottomSheet from "../common/LoginRequiredBottomSheet";
import { useState } from 'react';

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
  return(
    
    <>
      <EmptyView
              title={`'${keyword}'와 관련한 검색 결과가 없어요`}
              actionText="글쓰기"
              onActionClick={handleClick}
              actionType="button"

            />
      
      <LoginRequiredBottomSheet
        isOpen={LoginSheetOpen}
        onClose={() => setLoginSheetOpen(false)}
      />

    </>
 
  )
}

export default CommunitySearchEmptyView;
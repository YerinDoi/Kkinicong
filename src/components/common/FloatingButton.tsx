import { useNavigate } from 'react-router-dom';
import AddIcon from '@/assets/svgs/common/add-icon.svg';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import LoginRequiredBottomSheet from './LoginRequiredBottomSheet';
import { useState } from 'react';

const FloatingButton = () => {
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
    <>
    
      <button
        onClick={handleClick}
        className="bg-main-color shadow-floating flex gap-[8px] items-center px-[20px] py-[12px] rounded-[24px] w-[104px] h-[43px] text-[15px] text-white text-cursor-pointer z-50"
      >
        <img
          src={AddIcon}
          className="w-[14px] h-[14px] inline-block align-middle"
        />
        <p className="leading-none align-middle">글쓰기</p>
      </button>


      <LoginRequiredBottomSheet
        isOpen={LoginSheetOpen}
        onClose={() => setLoginSheetOpen(false)}
        pendingPath={pendingPath}
      />
    </>
    
  );
};

export default FloatingButton;
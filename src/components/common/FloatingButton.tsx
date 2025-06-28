import { useNavigate } from 'react-router-dom';
import AddIcon from '@/assets/svgs/common/add-icon.svg';

const FloatingButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/')} //경로 글 작성 페이지로 수정 예정
      className="bg-main-color shadow-floating flex gap-[8px] items-center px-[20px] py-[12px] rounded-[24px] w-[104px] h-[43px] text-[15px] text-white text-cursor-pointer z-50"
    >
      <img
        src={AddIcon}
        className="w-[14px] h-[14px] inline-block align-middle"
      />
      <p className="leading-none align-middle">글쓰기</p>
    </button>
  );
};

export default FloatingButton;

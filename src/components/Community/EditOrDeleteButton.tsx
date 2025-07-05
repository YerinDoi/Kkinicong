import EditOrDeleteBottomSheet from '@/components/Community/EditOrDeleteBottomSheet';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { useState } from 'react';
import Icon from '@/assets/icons';

const EditOrDeleteButton = () => {
  const navigate = useNavigate();
  const [isEDBottomSheetOpen, setIsEDBottomSheetOpen] = useState(false);

  const handleEDClick = () => {
    setIsEDBottomSheetOpen(true);
  };

  //게시글 수정하기
  const handleEdit = () => {
    // 실제 API 명세서나오면 수정예정
    console.log('수정 페이지로 이동!');
    // navigate(`/community/post/${postId}/edit`);
  };

  //게시글 삭제하기
  const handleDelete = async () => {
    if (!postId) return;
    try {
      await axiosInstance.delete(`/api/v1/community/post/${postId}`); //실제 API 명세서 나오면 수정 예정
      alert('삭제되었습니다!');
      navigate('/community');
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <button onClick={handleEDClick}>
        <Icon
          name="edit-or-delete"
          className="w-[3px] h-[14.25px] cursor-pointer"
        />
      </button>

      <EditOrDeleteBottomSheet
        isOpen={isEDBottomSheetOpen}
        onClose={() => setIsEDBottomSheetOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};

export default EditOrDeleteButton;

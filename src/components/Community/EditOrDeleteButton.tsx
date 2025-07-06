import EditOrDeleteBottomSheet from '@/components/Community/EditOrDeleteBottomSheet';
import { useState } from 'react';
import Icon from '@/assets/icons';
import DeleteModal from '../common/DeleteModal';

interface EditOrDeleteButtonProps {
  onEdit: () => void;
  onDelete: () => void;
}

const EditOrDeleteButton = ({ onEdit, onDelete }: EditOrDeleteButtonProps) => {
  const [isEDBottomSheetOpen, setIsEDBottomSheetOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsEDBottomSheetOpen(true)}>
        <Icon
          name="edit-or-delete"
          className="w-[3px] h-[14.25px] cursor-pointer"
        />
      </button>

      <EditOrDeleteBottomSheet
        isOpen={isEDBottomSheetOpen}
        onClose={() => setIsEDBottomSheetOpen(false)}
        onEdit={onEdit}
        onDelete={() => {
          setIsEDBottomSheetOpen(false); 
          setIsDeleteModalOpen(true);   
        }}
      />
      {isDeleteModalOpen && (
        <DeleteModal
          title="게시글을 정말 삭제하시겠어요?"
          description="삭제된 글은 복구시킬 수 없어요"
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={() => {
            setIsDeleteModalOpen(false);
            onDelete(); 
          }}
        />
      )}
    </>
  );
};

export default EditOrDeleteButton;
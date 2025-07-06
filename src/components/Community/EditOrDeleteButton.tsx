import EditOrDeleteBottomSheet from '@/components/Community/EditOrDeleteBottomSheet';
import { useState } from 'react';
import Icon from '@/assets/icons';

interface EditOrDeleteButtonProps {
  onEdit: () => void;
  onDelete: () => void;
}

const EditOrDeleteButton = ({ onEdit, onDelete }: EditOrDeleteButtonProps) => {
  const [isEDBottomSheetOpen, setIsEDBottomSheetOpen] = useState(false);

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
           onDelete();
          setIsEDBottomSheetOpen(false); 
   
        }}
      />
      
    </>
  );
};

export default EditOrDeleteButton;
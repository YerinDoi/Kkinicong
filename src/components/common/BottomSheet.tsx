interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-end z-50">
      <div className="w-full bg-white rounded-[10px] overflow-y-auto animate-slide-up">
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;

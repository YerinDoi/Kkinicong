// components/common/DeleteConvenienve.tsx

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConvenienve({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[20px] p-6 w-[300px] text-center shadow-lg">
        <p className="text-title-sb-button font-semibold mb-2">
          해당 글을 정말 삭제하시겠어요?
        </p>
        <p className="text-body-md-description text-[#919191] mb-5">
          삭제된 글은 복구할 수 없어요
        </p>

        <div className="flex gap-3">
          <button
            className="flex-1 py-3 border border-[#C3C3C3] rounded-[12px] text-title-sb-button font-semibold text-[#616161]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="flex-1 py-3 bg-[#65CE58] rounded-[12px] text-white text-title-sb-button font-semibold"
            onClick={onConfirm}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}

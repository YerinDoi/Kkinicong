import Icon from "@/assets/icons";
interface RecentKeywordProps {
  label: string;
  onDelete: () => void;
  onClick: () => void;
}

const RecentKeyword = ({ label, onDelete, onClick }: RecentKeywordProps) => {
  return (
    <div className="flex w-fit items-center px-[12px] py-[4px] bg-[#F4F6F8] border border-[#919191] text-body-md-title rounded-[6px] font-regular gap-[10px]" onClick={onClick}>
      <span>{label}</span>
      <button
        onClick={(e) => {
          e.stopPropagation(); // 삭제 버튼 클릭 시 검색 방지
          onDelete();
        }}
        className="w-[12px]"
      >
        <Icon name = "x"/>
      </button>
    </div>
  );
};

export default RecentKeyword;

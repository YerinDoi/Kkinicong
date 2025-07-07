import Icon from "@/assets/icons";
interface RecentKeywordProps {
  label: string;
  onDelete: () => void;
}

const RecentKeyword = ({ label, onDelete }: RecentKeywordProps) => {
  return (
    <div className="flex w-fit items-center px-[12px] py-[4px] bg-[#F4F6F8] border border-[#919191] text-body-md-title rounded-[6px] font-regular gap-[10px]">
      <span>{label}</span>
      <button onClick={onDelete} className="w-[12px]">
        <Icon name = "x"/>
      </button>
    </div>
  );
};

export default RecentKeyword;

import Icon from '../../assets/icons';

interface SearchInputProps {
  placeholder: string;
}

const SearchInput = ({ placeholder }: SearchInputProps) => {
  return (
    <div
      className="flex w-[320px] h-[44px] px-5 py-3 flex-col justify-center items-center gap-[10px]
                    rounded-xl border-2 border-main-color bg-white mt-[12px] mb-[12px]"
    >
      <div className="flex justify-between items-center self-stretch">
        <input
          type="text"
          placeholder={placeholder}
          className="self-stretch pt-[2px] text-[#919191] font-pretendard text-[12px] tracking-[0.012px]"
        />
        <Icon name="search" />
      </div>
    </div>
  );
};

export default SearchInput;

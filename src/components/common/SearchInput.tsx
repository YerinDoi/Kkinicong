import Icon from '../../assets/icons';

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const SearchInput = ({
  placeholder,
  value,
  onChange,
  onSearch,
}: SearchInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div
      className="flex w-full h-[44px] px-5 py-3 flex-col justify-center items-center gap-[10px]
                    rounded-xl border-2 border-main-color bg-white mt-[12px] mb-[12px]"
    >
      <div className="flex justify-between items-center self-stretch">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 text-main-gray text-[12px] tracking-[0.012px] focus:outline-none"
        />
        <button className="ml-2" onClick={onSearch}>
          <Icon name="search" />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;

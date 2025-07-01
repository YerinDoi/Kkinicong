import { useState } from 'react';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const CATEGORY_LIST = ['일상', '꿀팁', '건강', '질문', '기타'];

export default function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (category: string) => {
    onChange(category);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="mb-2 text-sm font-medium">카테고리</div>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full border rounded p-2 text-left bg-white"
      >
        {value || '카테고리를 선택하세요'}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg p-4 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-base font-semibold mb-3">카테고리 선택</div>
            <ul className="space-y-2">
              {CATEGORY_LIST.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => handleSelect(category)}
                    className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
                      value === category ? 'bg-green-100 font-semibold' : ''
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import Tag from '../common/Tag';

export interface TagSelectorProps {
  tags: string[];
  selectedTags: string[]; // 상위에서 전달받은 선택된 태그들
  onChange: (updated: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTags,
  onChange,
}) => {
  const toggleTag = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    let updated: string[];

    if (isSelected) {
      updated = selectedTags.filter((t) => t !== tag);
    } else {
      updated = [...selectedTags, tag];
    }

    onChange(updated); // 상위로 전달
  };

  return (
    <div className="flex flex-wrap gap-[12px]">
      {tags.map((tag) => (
        <Tag
          key={tag}
          label={tag}
          selected={selectedTags.includes(tag)}
          onClick={() => toggleTag(tag)}
          className="h-[32px]"
        />
      ))}
    </div>
  );
};

export default TagSelector;

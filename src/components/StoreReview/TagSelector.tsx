import React, { useState } from 'react';
import Tag from './Tag';
export interface TagSelectorProps {
  tags: string[];
  selectedTags: string[]; // 상위에서 전달
  onChange: (updated: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTags,
  onChange,
}) => {
  const [localSelected, setLocalSelected] = useState<string[]>(
    tags.filter((t) => selectedTags.includes(t)),
  );

  const toggleTag = (tag: string) => {
    const isSelected = localSelected.includes(tag);
    let updated: string[];

    if (isSelected) {
      updated = localSelected.filter((t) => t !== tag);
    } else {
      updated = [...localSelected, tag];
    }

    setLocalSelected(updated);
    onChange(updated); 
  };

  return (
    <div className="flex flex-wrap gap-[12px]">
      {tags.map((tag) => (
        <Tag
          key={tag}
          label={tag}
          selected={selectedTags.includes(tag)}
          onClick={() => toggleTag(tag)}
        />
      ))}
    </div>
  );
};

export default TagSelector;

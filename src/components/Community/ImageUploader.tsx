import { useRef } from 'react';
import imgAddIcon from '@/assets/icons/system/img-add.svg';

interface ImageUploaderProps {
  images: File[];
  setImages: (files: File[]) => void;
}

export default function ImageUploader({
  images,
  setImages,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);

    const overLimit = images.length + newFiles.length > 3;
    const oversize = newFiles.some((file) => file.size > 10 * 1024 * 1024);

    if (overLimit) {
      alert('이미지는 최대 3장까지 첨부할 수 있어요.');
      return;
    }
    if (oversize) {
      alert('10MB를 초과하는 이미지는 업로드할 수 없어요.');
      return;
    }

    setImages([...images, ...newFiles]);
  };

  const handleDelete = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div>
      <div className="flex gap-3">
        {images.map((file, idx) => {
          const preview = URL.createObjectURL(file);
          return (
            <div key={idx} className="relative w-[88px] h-[88px]">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover rounded-[12px]"
              />
              <button
                onClick={() => handleDelete(idx)}
                className="absolute -top-2 -right-2 bg-black bg-opacity-60 text-white text-xs px-1.5 rounded-full"
              >
                ×
              </button>
            </div>
          );
        })}

        {images.length < 3 && (
          <button onClick={() => fileInputRef.current?.click()}>
            <img src={imgAddIcon} alt="추가" className="w-[101px]" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleChange}
      />
    </div>
  );
}

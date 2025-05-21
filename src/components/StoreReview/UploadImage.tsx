import React, { useRef, useState, useEffect } from 'react';
import UploadIcon from '@/assets/svgs/review/upload-image.svg';
import AddIcon from '@/assets/svgs/review/add-image.svg';
import DeleteIcon from '@/assets/svgs/review/delete-img.svg';
import WarningToast from '@/components/common/WarningToast';

interface UploadImageProps {
  onFileSelect: (file: File | null) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/heic',
      'image/heif',
    ];
    const maxSizeInBytes = 10 * 1024 * 1024;

    try {
      if (!allowedTypes.includes(file.type)) {
        setToastMessage('지원하지 않는 형식이에요');
        setShowToast(true);
        e.target.value = '';
        return;
      }

      if (file.size > maxSizeInBytes) {
        setToastMessage('업로드 가능한 용량을 초과했어요');
        setShowToast(true);
        e.target.value = '';
        return;
      }

      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);
      onFileSelect(file);
    } catch {
      setToastMessage('이미지 업로드에 실패했어요');
      setShowToast(true);
      onFileSelect(null); 
    }
  };

  const handleDeleteImage = () => {
    setPreview(null);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="flex flex-col gap-[12px] font-pretendard">
      <p className="text-[#919191] text-sm">
        <span className="text-black font-semibold leading-[20px] text-base">
          사진을 추가해주세요
        </span>{' '}
        (선택/최대 1장)
      </p>

      <div
        className="relative w-[88px] h-[88px] cursor-pointer"
        onClick={handleUploadClick}
      >
        <div className="w-full h-full overflow-hidden rounded-[12px]">
          {preview ? (
            <>
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage();
                }}
                className="absolute top-0 right-0"
              >
                <img
                  src={DeleteIcon}
                  alt="삭제"
                  className="w-[26px] h-[26px] object-contain"
                />
              </button>
            </>
          ) : (
            <>
              <img
                src={UploadIcon}
                alt="업로드"
                className="w-full h-full object-cover"
              />
              <img
                src={AddIcon}
                alt="사진추가"
                className="absolute right-0 bottom-[31px] translate-x-[50%] w-[26px] h-[26px]"
              />
            </>
          )}
        </div>
      </div>

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.heic,.heif"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {showToast && toastMessage && <WarningToast text={toastMessage} />}
    </div>
  );
};

export default UploadImage;

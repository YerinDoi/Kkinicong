import React, { useRef, useState, useEffect } from 'react';
import UploadIcon from '@/assets/svgs/review/upload-image.svg';
import AddIcon from '@/assets/svgs/review/add-image.svg';
import DeleteIcon from '@/assets/svgs/review/delete-img.svg';
import WarningToast from '@/components/common/WarningToast';
import imageCompression from 'browser-image-compression';


interface UploadImageProps {
  onFileSelect: (file: File | null) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string[] | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

  //e.target.value = '';

  const file = e.target.files?.[0];
  console.log(' file:', file);
  console.log(' file type:', file?.type);
  console.log(' file size:', file?.size);
  console.log(' preview URL:', file ? URL.createObjectURL(file) : 'N/A');
  if (!file) return;

  const ext = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'heic', 'heif'];
  const maxSizeInBytes = 10 * 1024 * 1024;


  if (!ext || !allowedExtensions.includes(ext)) {
    setToastMessage(['지원하지 않는 형식이에요', '다시 시도해주세요']);
    setShowToast(true);
    return;
  }

  if (file.size > maxSizeInBytes) {
    setToastMessage(['업로드 가능한 용량을 초과했어요', '다시 시도해주세요']);
    setShowToast(true);
    return;
  }

  try {
    const compressedBlob = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: "image/webp",
      });

      const compressedFile = new File(
        [compressedBlob],
        file.name.replace(/\.[^/.]+$/, ".webp"), 
        {
          type: "image/webp",
          lastModified: Date.now(),
        }
      );

      // 압축된 파일 기준으로 미리보기 URL 생성
      const imageURL = URL.createObjectURL(compressedFile);
      setPreview(imageURL);
      onFileSelect(compressedFile);
  } catch {
    setToastMessage(['이미지 업로드에 실패했어요', '다시 시도해주세요']);
    setShowToast(true);
    onFileSelect(null);
  }
};

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleDeleteImage = () => {
    setPreview(null);
    onFileSelect(null);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="flex flex-col gap-[12px] font-pretendard">
      <p className="text-[#919191] text-body-md-title">
        <span className="text-black font-semibold leading-[20px] text-title-sb-button">
          사진을 추가해주세요
        </span>{' '}
        (선택/최대 1장)
      </p>

      <div
        className="relative w-[88px] h-[88px] cursor-pointer"
        onClick={handleUploadClick}
      >
        <div className="w-full h-full aspect-square overflow-hidden rounded-[12px]">
          {preview ? (
            <>
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
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

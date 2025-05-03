import React, { useRef, useState } from 'react';
import UploadIcon from '@/assets/svgs/review/upload-image.svg';
import AddIcon from '@/assets/svgs/review/add-image.svg';
import DeleteIcon from '@/assets/svgs/review/delete-img.svg';

const UploadImage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'image/jpeg', // .jpg, .jpeg
        'image/png',
        'image/heic',
        'image/heif',
      ];
      
      const maxSizeInBytes = 10 * 1024 * 1024; //용량 10MB이하
  
      if (!allowedTypes.includes(file.type)) {
        alert('허용되지 않은 파일 형식입니다. JPG, PNG, HEIC 형식만 업로드해주세요.');
        e.target.value = ''; // 선택된 파일 초기화
        return;
      }
  
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);
    }
  };

  const handleDeleteImage = () => {
    setPreview(null);
  };

  return (
    <div className="flex flex-col gap-[12px] font-pretendard">
      <p className="text-[#919191] text-sm">
        <span className="text-black font-semibold leading-[20px] text-base">
          사진을 추가해주세요
        </span>{' '}
        (선택/최대 1장)
      </p>

      {/* 업로드 박스 */}
      <div className="relative w-[88px] h-[88px] cursor-pointer" onClick={handleUploadClick}>
        {/* 이미지 미리보기 또는 기본 아이콘 */}
        <div className='w-full h-full overflow-hidden '>
          {preview ? (
            <>
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
              {/*삭제 아이콘*/}
              <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 div 클릭 방지
                    handleDeleteImage();
                  }}
                  className="absolute top-0 right-0">
                  <img src={DeleteIcon} alt="삭제" className="w-[26px] h-[26px] object-contain" />
              </button>
            </>
          ) : (
            <>
              <img src={UploadIcon} alt="업로드" className="w-full h-full object-cover" />
              <img src={AddIcon} alt="사진추가"  className="absolute right-0 bottom-[31px] transform translate-x-[50%] w-[26px] h-[26px]"/>
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
    </div>
  );
};

export default UploadImage;


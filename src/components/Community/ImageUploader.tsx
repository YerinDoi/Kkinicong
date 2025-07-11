import { useRef,useState ,useEffect} from 'react';
import imgAddIcon from '@/assets/icons/system/img-add.svg';
import WarningToast from '@/components/common/WarningToast';
import { createPortal } from 'react-dom';
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
  images: (File | string)[];
  setImages: (files: (File | string)[]) => void;
}

export default function ImageUploader({
  images,
  setImages,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [toastMessage, setToastMessage] = useState<string[] | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
  if (showToast) {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 1500);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 또는 showToast 재변경 시 타이머 정리
  }
}, [showToast]);



  const getPreviewUrl = (img: File | string) =>
  typeof img === 'string' ? img : URL.createObjectURL(img);


  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'heic', 'heif'];

    const overLimit = images.length + newFiles.length > 3;
    const oversize = newFiles.some((file) => file.size > 10 * 1024 * 1024);

    const invalidType = newFiles.some((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return !ext || !allowedExtensions.includes(ext);
    });

    if (overLimit) {
      setToastMessage(['이미지는 최대 3장까지','업로드 할 수 있어요']);
      setShowToast(true);
      return;
    }
    if (oversize) {
      setToastMessage(['업로드 가능한 용량을 초과했어요', '다시 시도해주세요']);
      setShowToast(true);
      return;
    }

    if (invalidType) {
      setToastMessage(['지원하지 않는 형식이에요','다시 시도해주세요']);
      setShowToast(true);
      return;
    }

    try {
      const compressedFiles: File[] = [];

      for (const file of newFiles) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
        compressedFiles.push(compressed);
      }

      setImages([...images, ...compressedFiles]);
    } catch (err) {
      console.error('이미지 압축 오류:', err);
      setToastMessage(['이미지 압축 중 오류가 발생했어요', '다시 시도해주세요']);
      setShowToast(true);
    }

    
  };

  const handleDelete = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div>
      <div className="flex gap-3">
        {images.map((img, idx) => {
          console.log('img:', img);
          console.log('preview:', getPreviewUrl(img));
   
          return (
            <div key={idx} className="relative w-[88px] h-[88px]">
              <img
                src={getPreviewUrl(img)}
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

      {showToast && toastMessage &&
        createPortal(
          <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
            <WarningToast
              text={toastMessage}
            />
          </div>,
          document.body,
        )}

    </div>
  );
}

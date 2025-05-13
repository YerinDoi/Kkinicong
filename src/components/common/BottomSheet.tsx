import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  children,
  onClose,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [, setTop] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTop(null);
      return;
    }

    const updatePosition = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      requestAnimationFrame(() => {
        const sheetHeight = sheetRef.current?.offsetHeight ?? 0;
        const newTop = scrollY + viewportHeight - sheetHeight;
        setTop(Math.max(newTop, 0));
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
  <div
    className="fixed inset-0 z-[9998] flex justify-center items-end"
    onClick={onClose}
  >
   
    <div
      className="relative w-[375px] h-full bg-black/40"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 w-full bg-white rounded-t-[12px] shadow-md font-pretendard max-h-[90vh] overflow-y-auto transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  </div>,
  document.body,
);
}
export default BottomSheet;

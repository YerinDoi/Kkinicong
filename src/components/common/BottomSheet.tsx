import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

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
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // 약간의 딜레이를 두고 translateY 적용해야 애니메이션이 자연스러움
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false); // 내려가도록 변경
      const timer = setTimeout(() => {
        setIsVisible(false); // 내려간 뒤 DOM 제거
      }, 150); // 트랜지션 시간에 맞춤
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex justify-center items-end"
      onClick={onClose}
    >
      <div className="relative w-[375px] h-full bg-black/40" onClick={onClose}>
        <div
          ref={sheetRef}
          className={classNames(
            'absolute bottom-0 left-0 w-full bg-white rounded-t-[12px] shadow-md font-pretendard max-h-[90vh] overflow-y-auto transition-transform duration-300 ease-out',
            isAnimating ? 'translate-y-0' : 'translate-y-full',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};
export default BottomSheet;

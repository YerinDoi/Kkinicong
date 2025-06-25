import { useState, useRef, useEffect } from 'react';

const LOWERED_SHEET_HEIGHT_FIXED = 148;

export default function useBottomSheet(headerHeight: number) {
  const [sheetHeight, setSheetHeight] = useState(0);
  const [raisedSheetHeight, setRaisedSheetHeight] = useState(0);
  const initialSheetHeightRef = useRef(0);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastYRef = useRef(0);

  // 바텀시트 높이 계산
  useEffect(() => {
    const calc = () => {
      const raised = window.innerHeight - headerHeight - 224;
      setRaisedSheetHeight(raised);
      if (sheetHeight === 0) setSheetHeight(raised);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [headerHeight, sheetHeight]);

  // 드래그 핸들러 (터치)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    initialSheetHeightRef.current = sheetHeight;
    startYRef.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDraggingRef.current) return;
    const deltaY = e.touches[0].clientY - startYRef.current;
    const newHeight = initialSheetHeightRef.current - deltaY;
    const clamped = Math.max(
      LOWERED_SHEET_HEIGHT_FIXED,
      Math.min(raisedSheetHeight, newHeight),
    );
    setSheetHeight(clamped);
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingRef.current = false;
    const halfway = (raisedSheetHeight + LOWERED_SHEET_HEIGHT_FIXED) / 2;
    if (sheetHeight < halfway) setSheetHeight(LOWERED_SHEET_HEIGHT_FIXED);
    else setSheetHeight(raisedSheetHeight);
  };

  // 드래그 핸들러 (마우스)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    initialSheetHeightRef.current = sheetHeight;
    startYRef.current = e.clientY;
    lastYRef.current = e.clientY;
    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('mouseup', handleMouseUp as any);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaY = e.clientY - startYRef.current;
    lastYRef.current = e.clientY;
    const newHeight = initialSheetHeightRef.current - deltaY;
    const clamped = Math.max(
      LOWERED_SHEET_HEIGHT_FIXED,
      Math.min(raisedSheetHeight, newHeight),
    );
    setSheetHeight(clamped);
  };
  const handleMouseUp = (e?: MouseEvent) => {
    isDraggingRef.current = false;
    const endY = e ? e.clientY : lastYRef.current;
    const deltaY = endY - startYRef.current;
    const newHeight = initialSheetHeightRef.current - deltaY;
    const halfway = (raisedSheetHeight + LOWERED_SHEET_HEIGHT_FIXED) / 2;
    if (newHeight < halfway) setSheetHeight(LOWERED_SHEET_HEIGHT_FIXED);
    else setSheetHeight(raisedSheetHeight);
    window.removeEventListener('mousemove', handleMouseMove as any);
    window.removeEventListener('mouseup', handleMouseUp as any);
  };

  return {
    sheetHeight,
    setSheetHeight,
    raisedSheetHeight,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDraggingRef,
  };
}

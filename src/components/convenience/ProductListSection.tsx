import { useNavigate } from 'react-router-dom';
import emptyImg from '@/assets/svgs/convenience/empty-logo.svg';
import NoSearchResults from '../common/NoSearchResults';
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from 'framer-motion';
import { useRef, useState } from 'react';

interface Product {
  id: number;
  name: string;
  isAvailable: boolean;
  relativeCreatedAt: string;
}
interface ProductListSectionProps {
  products: Product[];
  keyword?: string;
  onSwipePrev?: () => void;
  onSwipeNext?: () => void;
}

const SPRING: Transition = {
  type: 'spring',
  stiffness: 700,
  damping: 80,
  mass: 0.5,
};
const TWEEN_FAST: Transition = {
  type: 'tween',
  duration: 0.1,
  ease: 'easeOut',
};
const slide: Variants = {
  enter: (d: 1 | -1) => ({
    x: d === 1 ? 14 : -14,
    opacity: 1,
    transition: TWEEN_FAST,
  }),
  center: { x: 0, opacity: 1, transition: SPRING },
  exit: (d: 1 | -1) => ({
    x: d === 1 ? -10 : 10,
    opacity: 1,
    transition: TWEEN_FAST,
  }),
};

export default function ProductListSection({
  products = [],
  keyword,
  onSwipePrev,
  onSwipeNext,
}: ProductListSectionProps) {
  const navigate = useNavigate();

  // ---- 스와이프 억제(시간 기반) : ★ 컴포넌트 내부에서 useRef 사용
  const SUPPRESS_MS = 180;
  const lastSwipeAt = useRef(0);
  const justSwiped = () =>
    performance.now() - lastSwipeAt.current < SUPPRESS_MS;
  const markSwiped = () => {
    lastSwipeAt.current = performance.now();
  };

  // ---- 스와이프 감지
  const start = useRef<{ x: number; t: number } | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [swipeNonce, setSwipeNonce] = useState(0);

  const DIST = 36;
  const SPEED = 0.45; // px/ms

  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, t: performance.now() };
  };

  const finish = (dx: number, dt: number) => {
    const fast = Math.abs(dx) / Math.max(dt, 1) > SPEED;
    if (dx <= -DIST || (fast && dx < 0)) {
      setDir(1);
      markSwiped();
      onSwipeNext ? onSwipeNext() : setSwipeNonce((n) => n + 1);
    } else if (dx >= DIST || (fast && dx > 0)) {
      setDir(-1);
      markSwiped();
      onSwipePrev ? onSwipePrev() : setSwipeNonce((n) => n + 1);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!start.current) return;
    finish(e.clientX - start.current.x, performance.now() - start.current.t);
    start.current = null;
  };
  const onPointerCancel = () => {
    start.current = null;
  };

  // ----- 빈 결과 처리 -----
  if (products.length === 0) {
    if (keyword?.trim())
      return <NoSearchResults type="search" query={keyword} />;
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <img src={emptyImg} alt="조회 결과 없음" className="w-24 h-24" />
        <p className="text-body-md-title text-black text-center mt-4">
          아직은 공유된 제품 정보가 없어요
        </p>
        <p className="text-body-md-description text-main-gray text-center mt-2">
          여러분의 결제 경험을 공유해주세요
        </p>
      </div>
    );
  }

  // ----- 리스트 -----
  return (
    <ul
      className="px-[40px] py-[12px] flex flex-col select-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      style={{ touchAction: 'pan-y', overscrollBehavior: 'contain' as any }}
    >
      {products.map((p) => (
        <li
          key={p.id}
          onClick={() => {
            const suppressed = justSwiped();

            if (suppressed) return;
            navigate(`/convenience/post/${p.id}`);
          }}
          className="flex justify-between items-center py-[14px] border-b-[3px] border-bg-gray cursor-pointer"
        >
          {/* 왼쪽: 이름(애니메이션) + 시간(고정) */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="overflow-hidden min-w-0 h-[20px] flex items-center">
              <AnimatePresence mode="sync" initial={false} custom={dir}>
                <motion.span
                  key={`name-${p.id}-${swipeNonce}`}
                  variants={slide} // ★ 이름에 variants 적용
                  initial="enter"
                  animate="center"
                  exit="exit"
                  custom={dir}
                  className="inline-block leading-[20px] text-black text-body-bd-title font-semibold truncate will-change-transform"
                >
                  {p.name}
                </motion.span>
              </AnimatePresence>
            </div>

            <span className="leading-[20px] text-body-md-description text-main-gray">
              {p.relativeCreatedAt}
            </span>
          </div>

          {/* 오른쪽: 상태 뱃지(원하면 그대로) */}
          <div className="overflow-hidden w-[86px] text-right">
            <AnimatePresence mode="sync" initial={false} custom={dir}>
              <motion.span
                key={`avail-${p.id}-${swipeNonce}`}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                custom={dir}
                className={`inline-block text-[12px] leading-[18px] font-semibold tracking-[0.01em] bg-bg-gray border-[1px] rounded-[8px] px-3 py-1 will-change-transform ${
                  p.isAvailable
                    ? 'text-sub-color border-main-color'
                    : 'text-warning border-warning'
                }`}
              >
                {p.isAvailable ? '결제가능' : '결제불가'}
              </motion.span>
            </AnimatePresence>
          </div>
        </li>
      ))}
    </ul>
  );
}

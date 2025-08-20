import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/assets/icons';
import { categoryIconMap } from '@/constants/categories';
import { Store } from '@/types/store';

interface TopStoreItemProps {
  store: Store;
}

const TopStoreItem = ({ store }: TopStoreItemProps) => {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLDivElement | null>(null);
  const [isNameTwoLine, setIsNameTwoLine] = useState(false);

  // 이름 줄 수(1 or 2) 계산: 폰트 로드/리사이즈에도 반응
  useEffect(() => {
    if (!nameRef.current) return;

    const el = nameRef.current;

    const measure = () => {
      const cs = getComputedStyle(el);
      // line-height가 normal이면 fallback (프로젝트에서는 leading 지정되어 있어 OK)
      const lh = parseFloat(cs.lineHeight || '0') || 20;
      const lines = Math.round(el.offsetHeight / lh);
      setIsNameTwoLine(lines >= 2);
    };

    // 최초 측정 (레이아웃 확정 후)
    const raf = requestAnimationFrame(measure);

    // 리사이즈/컨텐츠 변동 대응
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // 폰트 늦게 로딩되는 경우 대비
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [store.name]);

  const handleStoreClick = () => {
    navigate(`/store/${store.id}`);
  };

  return (
    <div
      className="p-[12px] bg-[#FEFEFE] z-50 shadow-custom rounded-[10px] w-[124px] h-[160px]"
      onClick={handleStoreClick}
    >
      <div className="flex flex-col items-start gap-[6px] font-pretendard h-full">
        <Icon
          name={categoryIconMap[store.category] || 'etc'}
          className="max-w-[48px] max-h-[48px] w-auto h-auto object-contain"
        />

        <div className="flex flex-col justify-start items-start gap-[4px] w-full">
          {/* 가게 이름 (최대 2줄) */}
          <div
            ref={nameRef}
            className="leading-[1.1875] text-black text-title-sb-button font-bold tracking-tight line-clamp-2"
          >
            {store.name}
          </div>

          {/* 주소: 이름이 2줄이면 1줄, 1줄이면 2줄 */}
          <div
            className={`text-[#919191] text-body-md-description font-regular tracking-tight ${
              isNameTwoLine ? 'line-clamp-1' : 'line-clamp-2'
            }`}
          >
            {store.address}
          </div>

          {/* 조회수 */}
          <div className="mt-[4px] text-[#919191] text-body-md-description font-regular tracking-tight">
            조회 {store.viewCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopStoreItem;

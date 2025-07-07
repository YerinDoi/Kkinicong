import { useNavigate } from 'react-router-dom';
import EmptyView from './EmptyView';
import { useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  isAvailable: boolean;
}

interface ProductListSectionProps {
  products: Product[];
  onEmptyChange?: (isEmpty: boolean) => void;
  hasNextPage?: boolean;
  loaderRef?: React.RefObject<HTMLDivElement>;
  loading?: boolean;
}

export default function ProductListSection({
  products = [],
  onEmptyChange,
  hasNextPage,
  loaderRef,
  loading,
}: ProductListSectionProps) {
  const navigate = useNavigate();

  // useEffect로 empty 상태 알림
  useEffect(() => {
    if (onEmptyChange) onEmptyChange(products.length === 0);
  }, [products, onEmptyChange]);

  // 내가 쓴 편의점 게시판 글 X 경우 => 엠티뷰
  if (products.length === 0 && !loading) {
    return (
      <div className="flex flex-1 w-full h-full items-center justify-center bg-[#F4F6F8] relative">
        <div style={{ position: 'relative', top: '-36px' }}>
          <EmptyView
            title={'아직 작성한 글이 없어요\n당신의 결제 경험을 공유해주세요'}
            actionText="편의점 게시판으로 이동해볼까요?"
            onActionClick={() => navigate('/convenience')}
            actionType="link"
          />
        </div>
      </div>
    );
  }

  // 내가 쓴 편의점 게시판 글 O 경우 => 내가 쓴 편의점 게시판 글 리스트
  return (
    <>
      <ul className="flex flex-col gap-[8px] mt-[24px]">
        {products.map((product, idx) => (
          <li
            key={product.id}
            onClick={() => navigate(`/convenience/post/${product.id}`)}
            className="flex justify-between items-center px-[20px] py-[8px] border-b border-[#E6E6E6] cursor-pointer"
            style={
              idx === products.length - 1
                ? { borderBottom: 'none' }
                : { borderBottomWidth: '1.5px' }
            }
          >
            <span className="text-black text-title-sb-button font-semibold">
              {product.name}
            </span>
            <span
              className={`w-[55px] text-right text-body-md-title font-normal ${
                product.isAvailable ? 'text-[#65CE58]' : 'text-[#FF6452]'
              }`}
            >
              {product.isAvailable ? '결제가능' : '결제불가'}
            </span>
          </li>
        ))}
      </ul>
      {hasNextPage && <div ref={loaderRef} />}
    </>
  );
}

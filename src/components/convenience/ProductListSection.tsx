import { useNavigate } from 'react-router-dom';
import emptyImg from '@/assets/svgs/convenience/empty-logo.svg';
import NoSearchResults from '../common/NoSearchResults';

interface Product {
  id: number;
  name: string;
  isAvailable: boolean;
  relativeCreatedAt: string;
}

interface ProductListSectionProps {
  products: Product[];
  keyword?: string; // 검색어 (있으면 검색 결과 상태)
}

export default function ProductListSection({
  products = [],
  keyword,
}: ProductListSectionProps) {
  const navigate = useNavigate();

  // 결과가 없을 경우: 안내 메시지 + 일러스트 보여줌
  if (products.length === 0) {
    // 검색 키워드가 있을 경우 → NoSearchResults 보여줌
    if (keyword && keyword.trim() !== '') {
      return <NoSearchResults type="search" query={keyword} />;
    }

    return (
      <div className="flex flex-col items-center justify-center py-10">
        <img src={emptyImg} alt="조회 결과 없음" className="w-24 h-24" />
        <p className="text-body-md-title font-regular text-[#000000] text-center mt-4">
          아직은 공유된 제품 정보가 없어요
        </p>
        <p className="text-body-md-description font-regular text-[#919191] text-center mt-2">
          여러분의 결제 경험을 공유해주세요
        </p>
      </div>
    );
  }

  // 결과가 있을 경우: 상품 리스트 보여줌
  return (
    <ul className="px-[40px] py-[12px] flex flex-col gap-2">
      {products.map((product) => (
        <li
          key={product.id}
          onClick={() => navigate(`/convenience/post/${product.id}`)}
          className="flex justify-between items-center py-[8px] border-b-[3px] border-[#F4F6F8] cursor-pointer"
        >
          <div className='flex gap-2 items-center'>
            <span className="text-black text-body-bd-title font-semibold">
              {product.name}
            </span>
            <span className='text-body-md-description text-[#919191] item-center'>{product.relativeCreatedAt}</span>
          </div>
          <span
            className={`text-[12px] leading-[18px] font-semibold tracking-[0.01em] bg-[#F4F6F8] border-[1px] rounded-[8px] px-3 py-1 ${
              product.isAvailable ? 'text-[#029F64] border-[#029F64] ' : 'text-[#FF6452] border-[#FF6452]'
            }`}
          >
            {product.isAvailable ? '결제가능' : '결제불가'}
          </span>
        </li>
      ))}
    </ul>
  );
}

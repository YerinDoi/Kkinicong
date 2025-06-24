import { useNavigate } from 'react-router-dom';
import emptyImg from '@/assets/svgs/convenience/empty-logo.svg';

interface Product {
  id: number;
  name: string;
  isAvailable: boolean;
}

interface ProductListSectionProps {
  products: Product[];
}

export default function ProductListSection({
  products = [],
}: ProductListSectionProps) {
  const navigate = useNavigate();

  // 결과가 없을 경우: 안내 메시지 + 일러스트 보여줌
  if (products.length === 0) {
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

  // 결과가 있을 경우: 리스트 보여줌
  return (
    <ul className="px-[40px] py-3 flex flex-col gap-2 ">
      {products.map((product) => (
        <li
          key={product.id}
          onClick={() => navigate(`/convenience/post/${product.id}`)}
          className="flex justify-between items-center py-[8px] border-b-[3px] border-[#F4F6F8] cursor-pointer"
        >
          <span className="text-black text-body-bd-title font-semibold">
            {product.name}
          </span>
          <span
            className={`text-body-md-title font-normal ${
              product.isAvailable ? 'text-[#65CE58]' : 'text-[#FF6452]'
            }`}
          >
            {product.isAvailable ? '결제가능' : '결제불가'}
          </span>
        </li>
      ))}
    </ul>
  );
}

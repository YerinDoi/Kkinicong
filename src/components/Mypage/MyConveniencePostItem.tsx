import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  isAvailable: boolean;
}

interface ProductListSectionProps {
  products: Product[];
}

export default function ProductListSection({
  products = []
}: ProductListSectionProps) {
  const navigate = useNavigate();

  // 내가 쓴 편의점 게시판 글 X 경우 => 엠티뷰
  if (products.length === 0) {

    return (
      <div>
      </div>
    );
  }

  // 내가 쓴 편의점 게시판 글 O 경우 => 내가 쓴 편의점 게시판 글 리스트
  return (
    <ul className="flex flex-col gap-[8px] mt-[8px]">
      {products.map((product, idx) => (
        <li
          key={product.id}
          onClick={() => navigate(`/convenience/post/${product.id}`)}
          className="flex justify-between items-center px-[20px] py-[8px] border-b border-[#E6E6E6] cursor-pointer"
          style={
            idx === products.length - 1
              ? { borderBottom: "none" }
              : { borderBottomWidth: "1.5px" }
          }
        >
          <span className="text-black text-title-sb-button font-medium">
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
  );
}

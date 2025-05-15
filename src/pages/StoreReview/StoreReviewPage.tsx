import TopBar from '@/components/common/TopBar';
import StoreInfo from '@/components/StoreReview/StoreInfo';
import Rating from '@/components/StoreReview/Rating';
import SelectTag from '@/components/StoreReview/SelectTag';
import CommentBox from '@/components/StoreReview/CommentBox';
import UploadImage from '@/components/StoreReview/UploadImage';
import CheckBox from '@/components/StoreReview/CheckBox';

import { useParams } from 'react-router-dom';
import { mockStores } from '@/mocks/stores';

const StoreReviewPage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const store = mockStores.find((s) => s.id === storeId);
  if (!store) {
    return <div>가게 정보를 찾을 수 없습니다.</div>;
  }
  return (
    <div>
      <div className="flex flex-col w-full mt-[11px] mb-[29px] gap-[12px] font-pretendard">
        <TopBar title="리뷰 쓰기" />
        <StoreInfo
          category={store.category.name}
          name={store.name}
          address={store.address}
          badgeText={store.mainTag}
        />
        <div className="px-[16px] flex flex-col gap-[28px]">
          <Rating />
          <SelectTag />
          <CommentBox />
          <UploadImage />
          <CheckBox />
        </div>
      </div>
    </div>
  );
};

export default StoreReviewPage;

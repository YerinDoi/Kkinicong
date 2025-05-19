import { Store } from '@/types/store';
import StoreItem from './StoreItem';

interface StoreListProps {
  stores: Store[];
}

const StoreList = ({ stores }: StoreListProps) => {
  return (
    <div className="flex flex-col gap-[20px]">
      {stores.map((store) => (
        <StoreItem key={store.id} store={store} />
      ))}
    </div>
  );
};

export default StoreList;

import CommentItem, { CommentData } from '@/components/Community/CommentItem';
import Icon from '@/assets/icons';

interface ReplyItemProps {
  data: CommentData;
  postId: number;
  onReload?: () => void;
  isNew?: boolean;
}

const ReplyItem = ({ data, postId, onReload, isNew }: ReplyItemProps) => {
  return (
    <div
      className={`border-b-[1.5px] border-[#E6E6E6] ${isNew ? 'bg-[#F4F6F8]' : ''}`}
    >
      <div className="pt-[12px] flex gap-[12px] pl-[20px] ">
        <Icon name="reply" />
        <div className="flex-1">
          <CommentItem
            data={data}
            postId={postId}
            onReload={onReload}
            isReply
          />
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;

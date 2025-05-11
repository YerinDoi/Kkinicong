import React from 'react';
import YellowStar from '@/assets/svgs/review/yellow-star.svg';
import EmptyStar from '@/assets/svgs/review/disabled-star.svg';
import ProfileImg from '@/assets/svgs/common/profile-img.svg';
import AlarmIcon from '@/assets/svgs/common/alarm.svg';

interface ReviewItemProps {
  username: string;
  date: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  isOwner?: boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  username,
  date,
  rating,
  comment,
  imageUrl,
  isOwner,
}) => {
  return (
    <div className="flex flex-col gap-[20px] px-[16px] pb-[12px] border-b-[1.5px] border-[#E6E6E6]">
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[4px] ">
          <img src={ProfileImg} className="w-[36.3px]" />
          <div className="flex gap-[4px]">
            <span className="font-meidum text-sm">{username}</span>
            <span className="text-xs text-[#919191] self-end">{date}</span>
          </div>
        </div>
        <div className="flex justify-between h-[16.4px]">
          <div className="flex gap-[4px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <img
                key={i}
                src={i < rating ? YellowStar : EmptyStar}
                alt={i < rating ? '채워진 별' : '빈 별'}
                className="w-[17.123px] "
              />
            ))}
          </div>

          {isOwner ? (
            <button className="h-[28px] px-[6px] py-[12px] justify-center border-[1px] border-[#919191] bg-[#E6E6E6] text-xs font-medium">
              삭제
            </button>
          ) : (
            <button className="text-xs font-medium text-[#919191] flex gap-[4px]">
              <img src={AlarmIcon} className="h-[14px]" />
              <p>신고하기</p>
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-">
        <p className="text-sm font-medium leading-[18px] text-[#616161]">
          {comment}
        </p>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="리뷰 이미지"
            className="w-[100px] h-[80px] object-cover rounded-[12px]"
          />
        )}
      </div>
    </div>
  );
};

export default ReviewItem;

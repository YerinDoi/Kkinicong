import React, { useState, useEffect } from 'react';
import ProfileImg from '@/assets/svgs/common/profile-img.svg';
import OptimizedImage from './OptimizedImage';

interface BottomSheetFormProps {
  title: string;
  question: string;
  radioOptions: string[];
  buttonText: string;
  storeInfo?: {
    name: string;
    category?: string;
    mapComponent?: React.ReactNode;
  };
  reviewInfo?: {
    userName: string;
    content: string;
  };
  commentInfo?: {
    nickname: string;
    content: string;
  };
  postInfo?: {
    nickname: string;
    content: string;
  };

  onSubmit: (reason: string, description: string) => void;
  onCancel: () => void;
}

const BottomSheetForm: React.FC<BottomSheetFormProps> = ({
  title,
  question,
  radioOptions,
  buttonText,
  onSubmit,
  onCancel,
  storeInfo,
  reviewInfo,
  commentInfo,
  postInfo,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState('');
  useEffect(() => {
    if (text.trim().length > 0) {
      setSelected('기타');
    }
  }, [text]);

  const isDisabled =
    !selected || (selected === '기타' && text.trim().length === 0);

  return (
    <div className="flex flex-col gap-[8px] py-[16px]">
      <h2 className="text-body-md-title leading-[18px] text-center font-regular">
        {title}
      </h2>
      {/*가게 정보 수정 요청*/}
      {storeInfo && (
        <div className="px-[24px] flex flex-col gap-[12px] h-[184px]">
          <div className="flex flex-col gap-[2.635px]">
            {storeInfo.category && (
              <div className="text-body-md-description text-main-gray font-regular">
                {storeInfo.category}
              </div>
            )}
            <div className="text-title-sb-button font-bold">
              {storeInfo.name}
            </div>
          </div>

          {storeInfo.mapComponent && (
            <div className="w-full h-[120px] overflow-hidden">
              {storeInfo.mapComponent}
            </div>
          )}
        </div>
      )}
      {/*리뷰 신고*/}
      {reviewInfo && (
        <div className="px-[24px] flex flex-col gap-[12px]">
          <div className="flex gap-[4px] items-center">
            <OptimizedImage src={ProfileImg} alt="사용자 프로필 이미지" className="w-[36.3px] h-[36.3px] " />
            <span className="text-body-md-title font-regular leading-[24px]">
              {reviewInfo.userName}
            </span>
          </div>

          <span className="text-body-md-title mb-[13.7px] font-regular leading-[24px] text-text-gray">
            {reviewInfo.content}
          </span>
        </div>
      )}

      {/*댓글,답글 신고*/}
      {commentInfo && (
        <div className="px-[24px] flex flex-col gap-[12px]">
          <div className="flex gap-[4px] items-center">
            <OptimizedImage src={ProfileImg} alt="사용자 프로필 이미지" className="w-[36.3px] h-[36.3px] " />
            <span className="text-body-md-title font-regular leading-[24px]">
              {commentInfo.nickname}
            </span>
          </div>

          <span className="text-body-md-title mb-[13.7px] font-regular leading-[24px] text-text-gray">
            {commentInfo.content.length > 30
              ? commentInfo.content.slice(0, 30) + '...'
              : commentInfo.content}
          </span>
        </div>
      )}

      {/*게시글 신고*/}
      {postInfo && (
        <div className="px-[24px] flex flex-col gap-[12px]">
          <div className="flex gap-[4px] items-center">
            <OptimizedImage src={ProfileImg} alt="사용자 프로필 이미지" className="w-[36.3px] h-[36.3px] " />
            <span className="text-body-md-title font-regular leading-[24px]">
              {postInfo.nickname}
            </span>
          </div>

          <span className="text-body-md-title mb-[13.7px] font-regular leading-[24px] text-text-gray">
            {postInfo.content.length > 30
              ? postInfo.content.slice(0, 30) + '...'
              : postInfo.content}
          </span>
        </div>
      )}

      {/*공통*/}
      <div className="flex flex-col pt-[12px] gap-[8px] px-[39px] border-t-[2px] border-bg-gray">
        <p className="text-title-sb-button font-semibold leading-[20px]">
          {question}
        </p>
        <div className="py-[8px] flex flex-col gap-[4px]">
          {radioOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-[12px] py-[8px] cursor-pointer"
            >
              {/* 숨긴 input */}
              <input
                type="radio"
                name="edit-option"
                value={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
                className="sr-only" // 실제 화면에선 안 보임. 스크린 리더 전용
              />

              {/* 커스텀 원 */}
              <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center bg-sub-gray">
                {selected === option && (
                  <div className="w-[18px] h-[18px] bg-main-color rounded-full" />
                )}
              </div>
              <span className="font-semibold leading-[20px]">{option}</span>
            </label>
          ))}

          <textarea
            className="mt-[12px] w-full h-[66px] font-regular border-[1px] rounded-[12px] px-[16px] py-[12px] text-body-md-description"
            placeholder="최대 500자"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
          />
        </div>
      </div>

      <p className="text-center text-body-md-title font-regular">
        보내주신 의견은 운영팀이 검토 후 반영됩니다
      </p>
      <div className="flex justify-between mt-[8px] border-t-[2px] border-bg-gray">
        <button
          onClick={onCancel}
          className="w-1/2 text-center text-title-sb-button font-bold py-[12px]"
        >
          취소
        </button>

        <button
          onClick={() => {
            if (selected) {
              onSubmit(selected, text);
            } else {
              alert('수정 항목을 선택해주세요.');
            }
          }}
          disabled={isDisabled}
          className={`w-1/2 text-center text-title-sb-button font-bold py-[12px] ${
            isDisabled ? 'cursor-not-allowed' : ''
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default BottomSheetForm;

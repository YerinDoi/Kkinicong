interface FeedbackButtonsProps {
  isMine: boolean;
  correctCount: number;
  incorrectCount: number;
  userSelection: boolean | null;
  // true = correct, false = incorrect, null = 아직 투표 안함
  onVote: (isCorrect: boolean) => void;
}

export default function FeedbackButtons({
  isMine,
  correctCount,
  incorrectCount,
  userSelection,
  onVote,
}: FeedbackButtonsProps) {
  return (
    <div className="flex flex-col items-center mt-6">
      <div className="flex gap-3 w-full">
        <button
          onClick={() => onVote(true)}
          disabled={isMine}
          className={`flex-1 border-[1.5px] rounded-[12px] py-3 text-title-sb-button font-semibold ${
            isMine
              ? 'border-[#E0E0E0] text-[#C0C0C0] bg-[#F8F8F8] cursor-not-allowed'
              : userSelection === true
                ? 'bg-[#B1D960] border-[#C3C3C3] text-[#616161]'
                : 'bg-white hover:bg-[var(--BG,#F3F5ED)] border-[#C3C3C3] text-[#616161]'
          }`}
        >
          올바른 정보예요
          <span className="ml-2 font-semibold">{correctCount}</span>
        </button>
        <button
          onClick={() => onVote(false)}
          disabled={isMine}
          className={`flex-1 border-[1.5px] rounded-[12px] py-3 text-title-sb-button font-semibold ${
            isMine
              ? 'border-[#E0E0E0] text-[#C0C0C0] bg-[#F8F8F8] cursor-not-allowed'
              : userSelection === false
                ? 'bg-[#B1D960] border-[#C3C3C3] text-[#616161]'
                : 'bg-white hover:bg-[var(--BG,#F3F5ED)] border-[#C3C3C3] text-[#616161]'
          }`}
        >
          잘못된 정보예요
          <span className="ml-2 text-title-sb-button font-semibold">
            {incorrectCount}
          </span>
        </button>
      </div>

      {isMine && (
        <p className="mt-2 text-center text-[#B0B0B0] text-sm">
          본인이 작성한 글은 피드백할 수 없어요
        </p>
      )}
    </div>
  );
}

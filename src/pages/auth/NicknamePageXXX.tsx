import TopBar from '@/components/common/TopBar';

function NicknamePageXXX() {
  return (
    <div className="flex flex-col h-full px-4">
      <TopBar rightType="none" />

      {/* 타이틀 영역 */}
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-black">반가워요!</h1>
          <p className="text-xl font-bold text-[#65CE58]">
            사용할 닉네임을 정해주세요
          </p>
        </div>
        <p className="text-sm text-[#919191]">
          설정한 닉네임은 마이페이지에서 수정할 수 있어요
        </p>
      </div>

      {/* 입력 영역 */}
      <></>
    </div>
  );
}

export default NicknamePageXXX;

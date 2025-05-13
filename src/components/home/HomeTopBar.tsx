import LogoTextIcon from '@/assets/svgs/logo/logo-text.svg?react';
import LogoIcon from '@/assets/svgs/logo/logo-icon.svg?react';
import MenuIcon from '@/assets/icons/system/menu.svg?react';
import DropdownIcon from '@/assets/icons/system/dropdown-light.svg?react';

export default function HomeTopBar() {
  return (
    <div className="flex justify-between items-center h-12">
      {/* 왼쪽 영역 : 로고, 지역구 */}
      <div className="flex items-end gap-2">
        <div className="flex items-center gap-1">
          <LogoTextIcon className="w-16" />
          <LogoIcon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">인천 서구</span>
          <DropdownIcon />
        </div>
      </div>

      {/* 오른쪽 영역 : 로그인 버튼, 메뉴버튼(햄버거) */}
      <div className="flex items-center gap-2">
        <button className="text-sm text-[#919191]">로그인하기</button>
        <MenuIcon className="w-6 h-6" />
      </div>
    </div>
  );
}

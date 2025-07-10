// CarouselBanner.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useState } from 'react';
import CongG from '@/assets/svgs/logo/congG.svg'
import AddIcon from '@/assets/svgs/common/add-icon.svg'
import { useNavigate } from 'react-router-dom';


interface CarouselBannerProps {
  onSlideChange: (index: number) => void;
}


export default function CarouselBanner({ onSlideChange }: CarouselBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const slides = [
  {
    content: (
      <div className="flex justify-between px-[20px] ">
        <div className="h-full text-title-sb-button py-[14px] font-semibold leading-[20px] flex flex-col gap-[4px] justify-center">
          <p className="text-[#029F64]">아동급식카드</p>
          <p className="text-black">사용 가맹점을 검색하고,</p>
          <p className="text-black">리뷰를 남겨보세요!</p>
        </div>
        <object data={CongG} className="w-[122px]" />
      </div>
    ),
  },
  {

    content: (
      <div className=' px-[16px] font-semibold text-title-sb-button '>
        <div className='text-[#616161] flex flex-col h-[44px] justify-between'>
          <span >
          현재는 <span className="text-[#029F64] ">인천 지역</span>만 제공되며,        </span>
          <span >다른 지역은 요청이 많은 순으로 추가될 예정이에요.</span> 

        </div>
        
          

        <button className="mt-[12px] px-[16px] h-[28px] bg-[#65CE58] text-white rounded-[12px] text-body-md-title font-regular items-center flex gap-[8px]" onClick={() => navigate('/feedback')}>
          <img src={AddIcon} className='w-[12px] h-[12px]'/>
          지역 요청하기
        </button>
      </div>
    ),
  },
];


  return (
    <div className="w-full flex flex-col items-center">
  
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        onSlideChange={(swiper) => {
          const i = swiper.realIndex;
          setActiveIndex(i);
          onSlideChange(i);
        }}
        className="w-full overflow-hidden "
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="w-full h-full overflow-hidden py-[16px]">{slide.content}</div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex gap-[4px] mt">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-[8px] h-[8px] rounded-full ${
              i === activeIndex ? 'bg-[#919191]' : 'bg-[#C3C3C3]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}


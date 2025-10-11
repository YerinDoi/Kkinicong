// prettier-ignore
import type { Config } from 'tailwindcss';
import scrollbarHide from 'tailwind-scrollbar-hide';
import lineClamp from '@tailwindcss/line-clamp';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/styles/main.css',
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        
        black: '#212121',
        'main-color': '#65CE58',
        'sub-color': '#029F64',
        'disabled': '#E6E6E6',
        'warning': '#FF6452',
        'main-gray': '#919191',  
        'sub-gray': '#C3C3C3',
        'bg-gray': '#F4F6F8',
        'text-gray': '#616161',
        'bg': 'rgba(243, 245, 237, 1)',
      },
      boxShadow: {
        custom: '2px 4px 10px 0px rgba(0, 0, 0, 0.20)',
        bottom: '0px 4px 8px 0px rgba(0, 0, 0, 0.10)',
        floating: '0px 0px 8px 0px rgba(0, 0, 0, 0.25)'
      },
      fontSize: {
        'headline-sb-main'    : ['20px', { lineHeight: '32px', letterSpacing: '0' }],
        'headline-sb-sub'     : ['20px', { lineHeight: '28px', letterSpacing: '0' }],
        'title-sb-button'     : ['16px', { lineHeight: '20px', letterSpacing: '0' }],
        'body-md-title'       : ['14px', { lineHeight: '24px', letterSpacing: '0' }],
        'body-md-description' : ['12px', { lineHeight: '16px', letterSpacing: '0.1px' }],
        'body-bd-title'       : ['16px', { lineHeight: '24px', letterSpacing: '0.1px' }],
      },      
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [scrollbarHide, lineClamp]

};

export default config;

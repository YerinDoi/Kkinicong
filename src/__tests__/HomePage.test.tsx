// src/__tests__/HomePage.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/pages/home/HomePage';

describe('HomePage 컴포넌트', () => {
  test('"홈 페이지"라는 문구가 화면에 보이는지 확인', () => {
    render(<Home />);
    expect(screen.getByText('홈 페이지')).toBeInTheDocument();
  });
});

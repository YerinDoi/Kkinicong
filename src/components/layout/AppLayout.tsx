interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="w-screen h-screen bg-gray-100">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-full max-w-[375px] h-screen bg-white overflow-y-scroll scrollbar-hide "
      >
        {children}
      </div>
    </div>
  );
}

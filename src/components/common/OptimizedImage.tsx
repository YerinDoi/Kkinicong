import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // 첫 화면 LCP 이미지인 경우 true
}

export default function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden  ${
        className ?? ""
      }`}
      style={{ width, height }}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"} // 중요 이미지면 eager
        decoding="async"
        className={`object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && <div className="absolute inset-0 animate-pulse" />}
    </div>
  );
}

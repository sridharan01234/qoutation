import { memo, useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout?: 'fixed' | 'fill' | 'responsive' | 'intrinsic';
  className?: string;
  priority?: boolean;
  sizes?: string;
}

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  layout,
  className = '',
  priority = false,
  sizes = '100vw'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${isLoading ? 'bg-gray-200 animate-pulse' : ''}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        layout={layout}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoadingComplete={() => setIsLoading(false)}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
      />
    </div>
  );
});

export default OptimizedImage;
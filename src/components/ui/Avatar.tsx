'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps extends Omit<ImageProps, 'src' | 'onError'> {
  src?: string | null;
  fallbackText?: string;
}

export default function Avatar({ 
  src, 
  alt = 'avatar', 
  className, 
  fallbackText = '?', 
  ...props 
}: AvatarProps) {
  const [error, setError] = useState(false);

  const containerClasses = cn(
    "relative flex shrink-0 overflow-hidden rounded-full bg-stone-100 items-center justify-center",
    className
  );

  if (!src || error) {
    return (
      <div className={containerClasses} role="img" aria-label={alt}>
        <span className="text-xs font-bold text-stone-500 uppercase">
          {fallbackText.substring(0, 2)}
        </span>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <Image
        src={src}
        alt={alt}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}

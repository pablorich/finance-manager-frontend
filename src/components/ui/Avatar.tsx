'use client';

import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
  fallbackText?: string;
  height?: number;
  width?: number;
}

const AVATAR_PALETTES = [
  { background: '#277C78', hair: '#201F24', shirt: '#F2CDAC', skin: '#F8D8BE' },
  { background: '#82C9D7', hair: '#3F2B20', shirt: '#277C78', skin: '#E8B892' },
  { background: '#F2CDAC', hair: '#201F24', shirt: '#82C9D7', skin: '#C9825C' },
  { background: '#626070', hair: '#F8F4F0', shirt: '#F2CDAC', skin: '#9D6B53' },
  { background: '#93674F', hair: '#201F24', shirt: '#F8F4F0', skin: '#F0C4A3' },
] as const;

function getAvatarIndex(seed: string) {
  return seed.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
}

export default function Avatar({
  src,
  alt = 'avatar',
  className,
  fallbackText = '?',
}: AvatarProps) {
  void src;
  const containerClasses = cn(
    'relative flex shrink-0 overflow-hidden rounded-full items-center justify-center',
    className
  );
  const seed = alt || fallbackText;
  const avatarIndex = getAvatarIndex(seed);
  const palette = AVATAR_PALETTES[avatarIndex % AVATAR_PALETTES.length];
  const initials = fallbackText.substring(0, 2).toUpperCase();
  const smileOffset = avatarIndex % 2 === 0 ? 0 : 1;
  const eyeOffset = avatarIndex % 3;

  return (
    <div className={containerClasses} role="img" aria-label={alt}>
      <svg
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill={palette.background} height="64" rx="32" width="64" />
        <circle cx="32" cy="27" fill={palette.skin} r="15" />
        <path
          d="M17 27c1-12 8-18 18-18 9 0 14 6 14 16-7 0-12-2-17-7-3 5-8 8-15 9Z"
          fill={palette.hair}
        />
        <path d="M14 64c2-13 9-21 18-21s16 8 18 21H14Z" fill={palette.shirt} />
        <circle cx={27 - eyeOffset} cy="28" fill="#201F24" r="1.8" />
        <circle cx={38 + eyeOffset} cy="28" fill="#201F24" r="1.8" />
        <path
          d={`M27 ${35 + smileOffset}c3 3 7 3 10 0`}
          stroke="#201F24"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <text
          fill="rgba(255,255,255,0.68)"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="11"
          fontWeight="700"
          textAnchor="middle"
          x="32"
          y="58"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}

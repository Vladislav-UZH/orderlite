import { AvatarWrap } from './ui/ui-kit';
import type { ReactNode } from 'react';

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number;
  children?: ReactNode;
};

export function Avatar({ src, alt = 'avatar', size = 88, children }: AvatarProps) {
  if (src) {
    return (
      <AvatarWrap size={size}>
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AvatarWrap>
    );
  }
  return (
    <AvatarWrap size={size}>
      <span aria-hidden style={{ fontSize: size * 0.45, lineHeight: 1 }}>
        🧑🏻‍💻
      </span>
      {children}
    </AvatarWrap>
  );
}

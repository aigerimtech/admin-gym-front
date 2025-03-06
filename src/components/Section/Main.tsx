import React, { ReactNode } from 'react';
import { containerMaxW } from '../../config';

type Props = {
  children: ReactNode;
  className?: string; // Allow custom class names
};

export default function SectionMain({ children, className = '' }: Props) {
  return <section className={`p-6 ${containerMaxW} ${className}`}>{children}</section>;
}

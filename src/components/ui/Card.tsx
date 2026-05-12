import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  variant?: 'default' | 'glass' | 'gradient';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

export default function Card({
  children,
  className = '',
  onClick,
  padding = 'md',
  hoverable = false,
  variant = 'default',
}: CardProps) {
  const base = variant === 'glass'
    ? 'glass'
    : variant === 'gradient'
    ? 'gradient-border bg-white'
    : 'card-premium';

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.985 } : undefined}
      className={`
        ${base}
        ${paddingStyles[padding]}
        ${hoverable ? 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

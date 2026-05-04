import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const paddingStyles = {
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
}: CardProps) {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={`
        bg-surface rounded-2xl ios-shadow border border-gray-50
        ${paddingStyles[padding]}
        ${hoverable ? 'hover:shadow-lg hover:border-gray-100 transition-shadow duration-300' : ''}
        ${onClick ? 'cursor-pointer active:bg-gray-50' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

const variantStyles = {
  primary: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border border-amber-100',
  danger: 'bg-red-50 text-red-600 border border-red-100',
  neutral: 'bg-gray-50 text-gray-500 border border-gray-100',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[9px] tracking-wide',
  md: 'px-2.5 py-1 text-[10px] tracking-wide',
};

export default function Badge({ children, variant = 'primary', size = 'md' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full uppercase ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
}

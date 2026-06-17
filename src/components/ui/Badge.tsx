interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

const variantStyles = {
  primary: 'bg-[#1D1D1F] text-white',
  success: 'bg-black/[0.05] text-[#1D1D1F]',
  warning: 'bg-black/[0.05] text-[#1D1D1F]',
  danger:  'bg-[#FF3B30]/10 text-[#FF3B30]',
  neutral: 'bg-black/[0.05] text-[#636366]',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[9px] tracking-wide',
  md: 'px-2.5 py-1 text-[10px] tracking-wide',
};

export default function Badge({ children, variant = 'primary', size = 'md' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-semibold rounded-full uppercase ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
}

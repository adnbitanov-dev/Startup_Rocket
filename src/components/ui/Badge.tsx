interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

const variantStyles = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-green-700',
  warning: 'bg-warning/15 text-amber-700',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-gray-100 text-text-muted',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({ children, variant = 'primary', size = 'md' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
}

import { type InputHTMLAttributes, forwardRef, type ReactNode, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightIcon, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-muted">{label}</label>
        )}
        <div
          className={`
            flex items-center gap-2 px-4 py-3 rounded-xl
            bg-secondary border-2 transition-all duration-200
            ${isFocused ? 'border-primary bg-white shadow-md shadow-primary/10' : 'border-transparent'}
            ${error ? 'border-danger bg-red-50' : ''}
          `}
        >
          {icon && <span className="text-text-muted flex-shrink-0">{icon}</span>}
          <input
            ref={ref}
            className={`
              flex-1 bg-transparent outline-none text-text-main
              placeholder:text-text-muted/60 text-base
              ${className}
            `}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {rightIcon && <span className="text-text-muted flex-shrink-0">{rightIcon}</span>}
        </div>
        {error && <p className="text-sm text-danger font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

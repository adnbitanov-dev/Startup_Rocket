import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ArrowLeft, Shield, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';

interface PhoneAuthProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function PhoneAuth({ onSuccess, onBack }: PhoneAuthProps) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format phone for display
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 1) return '+7 ';
    if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= 11) {
      setPhone(raw.length === 0 ? '7' : raw);
    }
  };

  const handleSendCode = async () => {
    if (phone.length < 11) return;
    setIsLoading(true);
    // Mock delay
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    setStep('code');
    setCountdown(60);
    setTimeout(() => codeRefs.current[0]?.focus(), 300);
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      codeRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newCode.every(d => d !== '') && newCode.join('').length === 4) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleCodeKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (_code: string) => {
    setIsLoading(true);
    // Mock verification — any code works
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    onSuccess();
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="h-screen flex flex-col bg-background safe-area-pt safe-area-pb">
      {/* Header */}
      <div className="flex items-center px-4 pt-4">
        <button
          onClick={step === 'phone' ? onBack : () => setStep('phone')}
          className="w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={20} className="text-text-main" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-8 pt-8">
        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Phone size={28} className="text-primary" />
              </div>

              <h1 className="text-2xl font-bold text-text-main mb-2">Вход в аккаунт</h1>
              <p className="text-sm text-text-muted mb-8">Введите номер телефона для получения кода подтверждения</p>

              <div className="mb-6">
                <label className="text-sm font-medium text-text-muted mb-2 block">Номер телефона</label>
                <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-secondary border-2 border-transparent focus-within:border-primary focus-within:bg-white focus-within:shadow-lg focus-within:shadow-primary/10 transition-all duration-300">
                  <span className="text-xl">🇰🇿</span>
                  <input
                    type="tel"
                    value={formatPhone(phone)}
                    onChange={handlePhoneChange}
                    placeholder="+7 (___) ___-__-__"
                    className="flex-1 bg-transparent outline-none text-lg font-medium text-text-main placeholder:text-text-muted/40"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                icon={isLoading ? undefined : <ArrowRight size={20} />}
                isLoading={isLoading}
                disabled={phone.length < 11}
                onClick={handleSendCode}
              >
                Получить код
              </Button>

              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-text-muted">
                <Shield size={12} />
                <span>Мы отправим SMS с кодом подтверждения</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-6">
                <Shield size={28} className="text-success" />
              </div>

              <h1 className="text-2xl font-bold text-text-main mb-2">Код подтверждения</h1>
              <p className="text-sm text-text-muted mb-8">
                Отправлен на <span className="font-semibold text-text-main">{formatPhone(phone)}</span>
              </p>

              {/* Code inputs */}
              <div className="flex justify-center gap-3 mb-8">
                {code.map((digit, i) => (
                  <motion.input
                    key={i}
                    ref={(el) => { codeRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeInput(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className={`w-16 h-16 rounded-2xl text-center text-2xl font-bold outline-none transition-all duration-200 ${
                      digit
                        ? 'bg-primary/10 border-2 border-primary text-primary'
                        : 'bg-secondary border-2 border-transparent text-text-main'
                    } focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/10`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  />
                ))}
              </div>

              {isLoading && (
                <div className="flex items-center justify-center gap-2 mb-6 text-primary">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm font-medium">Проверяем код...</span>
                </div>
              )}

              {/* Resend */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-text-muted">
                    Отправить повторно через <span className="font-semibold text-text-main">{countdown}с</span>
                  </p>
                ) : (
                  <button
                    className="text-sm text-primary font-semibold hover:underline"
                    onClick={() => { setCountdown(60); setCode(['', '', '', '']); }}
                  >
                    Отправить код повторно
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

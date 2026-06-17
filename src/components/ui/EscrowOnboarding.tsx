import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Check, ShieldCheck, ArrowRight, Wallet } from 'lucide-react';

import Button from '../ui/Button';
import FaceIdModal from '../ui/FaceIdModal';

interface EscrowOnboardingProps {
  onComplete: () => void;
}

const BANKS = [
  { id: 'kaspi', name: 'Kaspi Bank', color: '#f14635' },
  { id: 'halyk', name: 'Halyk Bank', color: '#008542' },
  { id: 'bcc', name: 'Bank CenterCredit', color: '#003087' },
  { id: 'forte', name: 'ForteBank', color: '#7B2D8E' },
];

// Inline SVG logos resembling real bank branding
function BankLogo({ id, size = 28 }: { id: string; size?: number }) {
  switch (id) {
    case 'kaspi':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#F14635"/>
          <path d="M12 10h4v8l8-8h5l-9 9 10 11h-5.5L16 22v8h-4V10z" fill="white"/>
        </svg>
      );
    case 'halyk':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#008542"/>
          <path d="M8 20c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12S8 26.627 8 20z" fill="none" stroke="white" strokeWidth="2"/>
          <path d="M14 14v12M26 14v12M14 20h12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      );
    case 'bcc':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#003087"/>
          <path d="M10 12h6c3 0 5 1.5 5 4s-2 4-5 4h-6V12zM10 20h7c3 0 5 1.5 5 4s-2 4-5 4h-7V20z" fill="white"/>
          <circle cx="30" cy="16" r="4" fill="#FFD700"/>
          <circle cx="30" cy="26" r="4" fill="#FFD700"/>
        </svg>
      );
    case 'forte':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#7B2D8E"/>
          <path d="M12 10h16v4H16.5v4H26v4H16.5v8H12V10z" fill="white"/>
          <circle cx="30" cy="12" r="3" fill="#00E5A0"/>
        </svg>
      );
    default:
      return null;
  }
}

export default function EscrowOnboarding({ onComplete }: EscrowOnboardingProps) {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'opening'>('select');
  const [showFaceId, setShowFaceId] = useState(false);

  const handleOpenAccount = () => {
    setShowFaceId(true);
  };

  const handleFaceIdSuccess = () => {
    setShowFaceId(false);
    setStep('opening');
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-background safe-area-pt safe-area-pb p-6">
      <AnimatePresence mode="wait">
        {step === 'select' ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Building2 size={32} className="text-primary" />
            </div>

            <h1 className="text-2xl font-black text-text-main leading-tight mb-2">
              Эскроу-счет
            </h1>
            <p className="text-sm text-text-muted mb-8 leading-relaxed">
              Выберите банк, в котором будет открыт ваш цифровой эскроу-счет для безопасных сделок.
            </p>

            <div className="grid gap-3 flex-1 overflow-y-auto pb-4">
              {BANKS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedBank === bank.id
                      ? 'border-primary bg-white shadow-xl shadow-primary/10'
                      : 'border-transparent bg-white/50 hover:bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
                    <BankLogo id={bank.id} size={48} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-text-main">{bank.name}</p>
                  </div>
                  {selectedBank === bank.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white"
                    >
                      <Check size={14} strokeWidth={3} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            <Button
              fullWidth
              size="lg"
              disabled={!selectedBank}
              onClick={handleOpenAccount}
              icon={<ArrowRight size={20} />}
              className="mt-4"
            >
              Открыть эскроу-счет
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="opening"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-4"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Wallet size={48} className="text-primary" />
              </motion.div>
              <motion.div
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 0 }}
                className="absolute inset-0"
              >
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="62"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-primary"
                    strokeDasharray="390"
                    strokeDashoffset="0"
                  />
                </svg>
              </motion.div>
            </div>

            <h2 className="text-2xl font-black text-text-main mb-3">
              Открываем счет...
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">
              Ваш цифровой эскроу-счет в {BANKS.find(b => b.id === selectedBank)?.name} создается. <br/>
              Подождите несколько секунд.
            </p>
            
            <div className="mt-12 flex items-center gap-2 text-xs font-bold text-success uppercase tracking-widest bg-success/10 px-4 py-2 rounded-full">
              <ShieldCheck size={16} />
              Подписано через EDS
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FaceIdModal
        isOpen={showFaceId}
        onSuccess={handleFaceIdSuccess}
      />
    </div>
  );
}

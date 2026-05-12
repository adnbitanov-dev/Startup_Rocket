import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompletionModalProps {
  isOpen: boolean;
  orderTitle: string;
  amount: number;
  onClose: () => void;
}

export default function CompletionModal({ isOpen, orderTitle, amount, onClose }: CompletionModalProps) {
  const navigate = useNavigate();

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(n);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center"
          style={{ background: 'rgba(15,15,35,0.7)', backdropFilter: 'blur(12px)' }}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="w-full max-w-lg bg-white rounded-t-[32px] px-6 pt-4 pb-10"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

            {/* Celebration icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
                className="relative"
              >
                {/* Glow ring */}
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                  className="absolute inset-0 rounded-full bg-emerald-400"
                />
                <div className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <CheckCircle2 size={48} className="text-white" strokeWidth={1.5} />
                </div>
              </motion.div>
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-4"
            >
              <h2 className="text-2xl font-black text-text-main tracking-tight">
                Заказ завершён! 🎉
              </h2>
              <p className="text-text-muted text-sm mt-1.5 font-medium">{orderTitle}</p>
            </motion.div>

            {/* Amount card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-4 mb-4 text-center"
              style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0' }}
            >
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-widest mb-1">Выплачено исполнителю</p>
              <p className="text-3xl font-black text-emerald-700">{formatMoney(amount)}</p>
              <p className="text-[10px] text-emerald-500 mt-0.5">Средства переведены через эскроу ✓</p>
            </motion.div>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-4 mb-6 bg-amber-50 border border-amber-100"
            >
              <p className="text-xs text-amber-700 font-semibold text-center mb-2.5">Оцените исполнителя</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileTap={{ scale: 0.8 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + star * 0.06 }}
                  >
                    <Star size={32} className="text-warning fill-warning" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onClose();
                navigate('/customer/orders');
              }}
              className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}
            >
              Мои заказы
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

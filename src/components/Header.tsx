import { Bell, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../store/UserContext';
import { useState } from 'react';

export default function Header() {
  const { userName, role } = useUser();
  const [notifOpen, setNotifOpen] = useState(false);

  const initials = userName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'ГС';

  return (
    <header className="sticky top-0 z-40 safe-area-pt">
      {/* Frosted glass bar */}
      <div className="glass border-b border-white/60 px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <motion.div
            whileTap={{ scale: 0.92 }}
            className="w-8 h-8 rounded-xl gradient-hero flex items-center justify-center glow-primary"
          >
            <Sparkles size={15} className="text-white" strokeWidth={2.5} />
          </motion.div>
          <div>
            <span className="text-[15px] font-bold tracking-tight gradient-text">ГарантСтрой</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Role badge */}
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide ${
            role === 'customer'
              ? 'bg-indigo-50 text-indigo-600'
              : 'bg-emerald-50 text-emerald-600'
          }`}>
            {role === 'customer' ? '👤 Заказчик' : '🔨 Исполнитель'}
          </div>

          {/* Notifications */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/80 shadow-sm border border-white hover:bg-white transition-colors"
          >
            <Bell size={18} className="text-text-main" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full border-2 border-white" />
          </motion.button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {initials}
          </div>
        </div>
      </div>

      {/* Notification drawer */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mx-4 mt-2 card-premium p-3 space-y-2 z-50"
          >
            {[
              { icon: '✅', text: 'Этап «Демонтаж» принят', time: '2 мин назад' },
              { icon: '💬', text: 'Новое сообщение от Сергея', time: '15 мин назад' },
              { icon: '🔔', text: 'Новый отклик на ваш заказ', time: '1 ч назад' },
            ].map((n, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary transition-colors cursor-pointer">
                <span className="text-lg">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-main truncate">{n.text}</p>
                  <p className="text-[10px] text-text-muted">{n.time}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

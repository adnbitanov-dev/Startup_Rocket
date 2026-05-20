import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../store/UserContext';
import { useState } from 'react';

export default function Header() {
  const { userName, role } = useUser();
  const [notifOpen, setNotifOpen] = useState(false);

  const initials = userName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'ГС';

  return (
    <header className="sticky top-0 z-40 safe-area-pt">
      <div className="bg-white/80 backdrop-blur-xl border-b border-black/[0.04] px-5 h-12 flex items-center justify-between">
        {/* Logo — minimal */}
        <span className="text-[17px] font-extrabold tracking-tight text-text-main">
          ГарантСтрой
        </span>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <Bell size={18} className="text-text-main" strokeWidth={1.8} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-danger rounded-full" />
          </motion.button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-text-main flex items-center justify-center text-white text-[11px] font-bold tracking-wide">
            {initials}
          </div>
        </div>
      </div>

      {/* Notification drawer */}
      <AnimatePresence>
        {notifOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setNotifOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-4 mt-1 w-72 card-premium p-2 z-50"
            >
              {[
                { text: 'Этап «Демонтаж» принят', time: '2 мин назад' },
                { text: 'Новое сообщение от Сергея', time: '15 мин назад' },
                { text: 'Новый отклик на ваш заказ', time: '1 ч назад' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text-main leading-snug">{n.text}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

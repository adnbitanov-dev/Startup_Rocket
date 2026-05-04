import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 safe-area-pt">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">ГС</span>
          </div>
          <span className="text-base font-semibold text-text-main tracking-tight">ГарантСтрой</span>
        </div>

        {/* Notifications */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          <Bell size={22} className="text-text-main" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white" />
        </motion.button>
      </div>
    </header>
  );
}

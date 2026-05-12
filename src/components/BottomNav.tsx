import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, User, Search, Briefcase } from 'lucide-react';
import { useUser } from '../store/UserContext';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const { role } = useUser();

  const customerItems = [
    { to: '/customer', icon: Home, label: 'Главная' },
    { to: '/customer/orders', icon: ClipboardList, label: 'Заказы' },
    { to: '/profile', icon: User, label: 'Профиль' },
  ];

  const contractorItems = [
    { to: '/contractor', icon: Home, label: 'Главная' },
    { to: '/contractor/feed', icon: Search, label: 'Поиск' },
    { to: '/contractor/jobs', icon: Briefcase, label: 'Работы' },
    { to: '/profile', icon: User, label: 'Профиль' },
  ];

  const navItems = role === 'customer' ? customerItems : contractorItems;

  return (
    <nav className="fixed bottom-0 w-full safe-area-pb z-50">
      {/* Blurred background */}
      <div className="glass border-t border-white/60 shadow-2xl shadow-black/10">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/customer' || to === '/contractor'}
              className="flex-1"
            >
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="flex flex-col items-center justify-center gap-1 py-1"
                >
                  <div className={`
                    w-10 h-8 flex items-center justify-center rounded-xl transition-all duration-300
                    ${isActive
                      ? 'bg-gradient-to-br from-primary to-violet-600 glow-primary'
                      : 'bg-transparent'
                    }
                  `}>
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={isActive ? 'text-white' : 'text-text-muted'}
                    />
                  </div>
                  <span className={`text-[9px] font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-primary' : 'text-text-muted'
                  }`}>
                    {label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

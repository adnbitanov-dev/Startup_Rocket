import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Search, ShieldCheck, User } from 'lucide-react';
import { useUser } from '../store/UserContext';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const { role } = useUser();
  const location = useLocation();

  const NavItem = ({ to, icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
    <NavLink to={to} className="flex-1">
      <motion.div
        whileTap={{ scale: 0.85 }}
        className="flex flex-col items-center justify-center py-1 relative"
      >
        <div className={`p-1.5 rounded-full transition-all duration-300 ${
          active ? 'text-[#1D1D1F]' : 'text-[#C7C7CC]'
        }`}>
          {icon}
        </div>
        <span className={`text-[10px] mt-0.5 font-semibold transition-colors duration-300 ${
          active ? 'text-[#1D1D1F]' : 'text-[#C7C7CC]'
        }`}>
          {label}
        </span>
        {active && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute -top-1 w-5 h-[3px] rounded-full bg-[#1D1D1F]"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </motion.div>
    </NavLink>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-black/[0.04] px-4 pb-7 pt-1 flex justify-around items-center max-w-md mx-auto">
      <NavItem
        to="/"
        icon={<LayoutGrid className="w-[22px] h-[22px]" strokeWidth={1.8} />}
        label={role === 'customer' ? 'Проекты' : 'Задания'}
        active={location.pathname === '/' || location.pathname.startsWith('/customer') || location.pathname.startsWith('/contractor')}
      />
      {role === 'contractor' && (
        <NavItem
          to="/available-orders"
          icon={<Search className="w-[22px] h-[22px]" strokeWidth={1.8} />}
          label="Биржа"
          active={location.pathname === '/available-orders'}
        />
      )}
      {role === 'admin' && (
        <NavItem
          to="/admin"
          icon={<ShieldCheck className="w-[22px] h-[22px]" strokeWidth={1.8} />}
          label="Админ"
          active={location.pathname === '/admin'}
        />
      )}
      <NavItem
        to="/profile"
        icon={<User className="w-[22px] h-[22px]" strokeWidth={1.8} />}
        label="Профиль"
        active={location.pathname === '/profile'}
      />
    </nav>
  );
}

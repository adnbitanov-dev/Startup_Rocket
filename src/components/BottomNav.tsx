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
        whileTap={{ scale: 0.9 }}
        className="flex flex-col items-center justify-center py-1"
      >
        <div className={`
          p-2 rounded-xl transition-all duration-300
          ${active ? 'bg-primary/10 text-primary' : 'text-gray-400'}
        `}>
          {icon}
        </div>
        <span className={`text-[10px] mt-1 font-medium ${active ? 'text-primary' : 'text-gray-400'}`}>
          {label}
        </span>
      </motion.div>
    </NavLink>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-4 pb-6 pt-2 flex justify-around items-center max-w-md mx-auto rounded-t-[32px] shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
      <NavItem 
        to="/" 
        icon={<LayoutGrid className="w-6 h-6" />} 
        label={role === 'customer' ? 'Заказы' : 'Задания'} 
        active={location.pathname === '/' || location.pathname.startsWith('/customer') || location.pathname.startsWith('/contractor')} 
      />
      
      {role === 'contractor' && (
        <NavItem 
          to="/available-orders" 
          icon={<Search className="w-6 h-6" />} 
          label="Биржа" 
          active={location.pathname === '/available-orders'} 
        />
      )}

      {role === 'admin' && (
        <NavItem 
          to="/admin" 
          icon={<ShieldCheck className="w-6 h-6" />} 
          label="Админ" 
          active={location.pathname === '/admin'} 
        />
      )}
      
      <NavItem 
        to="/profile" 
        icon={<User className="w-6 h-6" />} 
        label="Профиль" 
        active={location.pathname === '/profile'} 
      />
    </nav>
  );
}

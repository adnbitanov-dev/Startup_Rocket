import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Search, ShieldCheck, User } from 'lucide-react';
import { useUser } from '../store/UserContext';
import { motion } from 'framer-motion';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export default function BottomNav() {
  const { role } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const allItems: NavItem[] = [
    {
      to: role === 'customer' ? '/customer' : role === 'admin' ? '/admin' : '/contractor',
      icon: <LayoutGrid className="w-[20px] h-[20px]" strokeWidth={1.8} />,
      label: role === 'customer' ? 'Проекты' : role === 'admin' ? 'Панель' : 'Задания',
    },
    ...(role === 'contractor' ? [{
      to: '/contractor/feed',
      icon: <Search className="w-[20px] h-[20px]" strokeWidth={1.8} />,
      label: 'Биржа',
    }] : []),
    {
      to: '/profile',
      icon: <User className="w-[20px] h-[20px]" strokeWidth={1.8} />,
      label: 'Профиль',
    },
  ];

  const isActive = (item: NavItem) => {
    if (item.to === '/contractor/feed') return location.pathname.startsWith('/contractor/feed');
    if (item.to === '/contractor') return location.pathname.startsWith('/contractor') && !location.pathname.startsWith('/contractor/feed');
    if (item.to === '/customer') return location.pathname.startsWith('/customer');
    if (item.to === '/admin') return location.pathname.startsWith('/admin');
    return location.pathname === item.to;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-6 max-w-md mx-auto pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1 bg-[#1C1C1E]/90 backdrop-blur-xl rounded-full px-2 py-2 shadow-2xl shadow-black/30">
        {allItems.map((item) => {
          const active = isActive(item);
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className="relative flex items-center justify-center rounded-full transition-all duration-200"
              style={{ minWidth: active ? 'auto' : '48px', height: '44px' }}
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <motion.div
                className={`relative z-10 flex items-center gap-2 px-4`}
                animate={{ color: active ? '#1D1D1F' : 'rgba(255,255,255,0.45)' }}
                transition={{ duration: 0.2 }}
              >
                {item.icon}
                {active && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-[13px] font-bold whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

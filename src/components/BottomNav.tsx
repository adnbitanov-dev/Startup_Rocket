import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, User, Search, Briefcase } from 'lucide-react';
import { useUser } from '../store/UserContext';

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
    <nav className="fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 ios-shadow safe-area-pb z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/customer' || to === '/contractor'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-text-muted hover:text-gray-600'
              }`
            }
          >
            <Icon size={22} strokeWidth={2.2} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

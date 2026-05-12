import { motion } from 'framer-motion';
import { Phone, Shield, Fingerprint, ChevronRight, LogOut, Star, FileText, HelpCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useUser } from '../store/UserContext';
import { useData } from '../store/DataContext';
import { useNavigate } from 'react-router-dom';

const container: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item: any = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  badge?: string;
  danger?: boolean;
  onClick?: () => void;
}

export default function Profile() {
  const { role, userPhone, userName, logout } = useUser();
  const { customerOrders, contractorActiveJobs } = useData();
  const isCustomer = role === 'customer';

  const completedCount = isCustomer 
    ? customerOrders.filter(o => o.status === 'completed').length
    : 0;
  
  const activeCount = isCustomer
    ? customerOrders.filter(o => o.status !== 'completed').length
    : contractorActiveJobs.length;

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Безопасность',
      items: [
        { icon: <Fingerprint size={20} className="text-primary" />, label: 'Face ID / Touch ID', subtitle: 'Настроить биометрию', badge: 'WebAuthn' },
        { icon: <Shield size={20} className="text-success" />, label: 'Верификация', subtitle: 'Личность подтверждена' },
        { icon: <Phone size={20} className="text-indigo-500" />, label: 'Номер телефона', subtitle: userPhone },
      ],
    },
    {
      title: 'Приложение',
      items: [
        { icon: <Star size={20} className="text-warning" />, label: 'Оценить приложение' },
        { icon: <FileText size={20} className="text-text-muted" />, label: 'Условия использования' },
        { icon: <HelpCircle size={20} className="text-text-muted" />, label: 'Поддержка', subtitle: 'Помощь и FAQ' },
      ],
    },
    {
      title: '',
      items: [
        { icon: <LogOut size={20} className="text-danger" />, label: 'Выйти из аккаунта', danger: true, onClick: logout },
      ],
    },
  ];

  const stats = isCustomer
    ? [
        { value: activeCount.toString(), label: 'Активных' },
        { value: '⭐ 4.9', label: 'Рейтинг' },
        { value: completedCount.toString(), label: 'Завершено' },
      ]
    : [
        { value: activeCount.toString(), label: 'В работе' },
        { value: '⭐ 4.8', label: 'Рейтинг' },
        { value: '12', label: 'Отзывов' },
      ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-4">
      {/* Profile card */}
      <motion.div variants={item}>
        <Card className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg ${
            isCustomer
              ? 'bg-gradient-to-br from-primary to-indigo-500 shadow-primary/25'
              : 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-green-500/25'
          }`}>
            {userName?.split(' ').map(n => n[0]).join('') || 'ГС'}
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-text-main">{userName || 'Пользователь'}</h1>
            <p className="text-sm text-text-muted">{userPhone}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={isCustomer ? 'primary' : 'success'}>
                {isCustomer ? '👤 Заказчик' : '🔨 Исполнитель'}
              </Badge>
              <Badge variant="success" size="sm">✓ Верифицирован</Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} padding="sm" className="text-center">
            <p className="text-lg font-bold text-text-main">{stat.value}</p>
            <p className="text-[11px] text-text-muted mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </motion.div>

      {/* Menu */}
      {menuSections.map((section, sIdx) => (
        <motion.div key={sIdx} variants={item}>
          {section.title && (
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">{section.title}</h2>
          )}
          <Card padding="sm">
            <div className="divide-y divide-gray-50">
              {section.items.map((menuItem, mIdx) => (
                <button
                  key={mIdx}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  onClick={menuItem.onClick}
                >
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">{menuItem.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${menuItem.danger ? 'text-danger' : 'text-text-main'}`}>{menuItem.label}</p>
                    {menuItem.subtitle && <p className="text-xs text-text-muted mt-0.5">{menuItem.subtitle}</p>}
                  </div>
                  {menuItem.badge && <Badge variant="neutral" size="sm">{menuItem.badge}</Badge>}
                  {!menuItem.danger && <ChevronRight size={16} className="text-text-muted flex-shrink-0" />}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}

      <motion.div variants={item} className="text-center">
        <p className="text-xs text-text-muted/50">ГарантСтрой MVP v1.0</p>
      </motion.div>
    </motion.div>
  );
}

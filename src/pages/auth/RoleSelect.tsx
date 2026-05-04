import { motion } from 'framer-motion';
import { HardHat, User, ArrowRight } from 'lucide-react';
import type { UserRole } from '../../types';

interface RoleSelectProps {
  onSelect: (role: UserRole) => void;
}

const roles = [
  {
    role: 'customer' as UserRole,
    icon: User,
    emoji: '🏠',
    title: 'Заказчик',
    subtitle: 'Я ищу мастера для ремонта или строительства',
    features: ['Создание заказов', 'Эскроу-защита', 'Приёмка через Face ID'],
    gradient: 'from-primary to-blue-600',
    bgLight: 'bg-primary/5',
    borderActive: 'border-primary',
  },
  {
    role: 'contractor' as UserRole,
    icon: HardHat,
    emoji: '🔨',
    title: 'Исполнитель',
    subtitle: 'Я выполняю ремонтные и строительные работы',
    features: ['Поиск заказов', 'Гарантия оплаты', 'Рейтинг и отзывы'],
    gradient: 'from-emerald-500 to-green-600',
    bgLight: 'bg-emerald-50',
    borderActive: 'border-emerald-500',
  },
];

export default function RoleSelect({ onSelect }: RoleSelectProps) {
  return (
    <div className="h-screen flex flex-col bg-background safe-area-pt safe-area-pb">
      <div className="flex-1 flex flex-col px-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <h1 className="text-2xl font-bold text-text-main mb-2">Кто вы?</h1>
          <p className="text-sm text-text-muted mb-8">Выберите вашу роль на платформе. Вы сможете переключиться позже в настройках.</p>
        </motion.div>

        <div className="space-y-4">
          {roles.map((r, i) => (
            <motion.button
              key={r.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(r.role)}
              className={`w-full text-left p-5 rounded-2xl border-2 border-gray-100 hover:${r.borderActive} ${r.bgLight} hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                  <span className="text-2xl">{r.emoji}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-text-main">{r.title}</h3>
                    <ArrowRight size={18} className="text-text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-text-muted mt-1">{r.subtitle}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {r.features.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 rounded-lg bg-white/80 text-[11px] font-medium text-text-muted border border-gray-100"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-8 pb-8 text-center">
        <p className="text-xs text-text-muted/60">Вы всегда можете изменить роль в профиле</p>
      </div>
    </div>
  );
}

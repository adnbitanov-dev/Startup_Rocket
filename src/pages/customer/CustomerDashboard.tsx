import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Clock, ChevronRight, Shield, Plus, Zap, BarChart3 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

import { customerEscrow, formatMoney, statusLabels, statusVariants } from '../../mock/data';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../store/DataContext';
import { useUser } from '../../store/UserContext';

const container: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } } };

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { customerOrders } = useData();
  const { userName } = useUser();
  const firstName = userName?.split(' ')[0] || 'Клиент';
  const activeOrders = customerOrders.filter((o) => o.status !== 'completed');
  const completedOrders = customerOrders.filter((o) => o.status === 'completed');
  const currentMilestone = customerOrders[0]?.milestones.find((m) => m.status === 'in_progress');
  const completedMs = customerOrders[0]?.milestones.filter(m => m.status === 'accepted').length || 0;
  const totalMs = customerOrders[0]?.milestones.length || 1;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 pb-6">

      {/* Hero greeting */}
      <motion.div variants={item} className="pt-1">
        <p className="text-text-muted text-sm font-medium">Добро пожаловать 👋</p>
        <h1 className="text-2xl font-bold text-text-main mt-0.5 tracking-tight">{firstName}</h1>
      </motion.div>

      {/* Escrow hero card */}
      <motion.div variants={item}>
        <div className="relative overflow-hidden rounded-2xl gradient-hero p-5 glow-primary">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-4 w-28 h-28 rounded-full bg-white/5" />

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
                  <Shield size={12} /> Эскроу-защита
                </p>
                <p className="text-4xl font-black mt-1.5 text-white tracking-tight">
                  {formatMoney(customerEscrow.heldAmount)}
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  из {formatMoney(customerEscrow.totalAmount)} заблокировано
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Wallet size={24} className="text-white" />
              </div>
            </div>

            <div className="flex gap-4 pt-3 border-t border-white/15">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                  <TrendingUp size={13} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">Выплачено</p>
                  <p className="text-sm font-bold text-white">{formatMoney(customerEscrow.releasedAmount)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                  <Clock size={13} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">Активных</p>
                  <p className="text-sm font-bold text-white">{activeOrders.length} заказов</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {[
          { icon: <Zap size={18} className="text-indigo-500" />, value: activeOrders.length, label: 'В работе', bg: 'bg-indigo-50' },
          { icon: <BarChart3 size={18} className="text-emerald-500" />, value: completedOrders.length, label: 'Завершено', bg: 'bg-emerald-50' },
          { icon: <TrendingUp size={18} className="text-amber-500" />, value: '4.9 ⭐', label: 'Рейтинг', bg: 'bg-amber-50' },
        ].map((s, i) => (
          <Card key={i} padding="sm" className="text-center">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              {s.icon}
            </div>
            <p className="text-lg font-black text-text-main leading-none">{s.value}</p>
            <p className="text-[10px] text-text-muted mt-0.5 font-medium">{s.label}</p>
          </Card>
        ))}
      </motion.div>

      {/* Current milestone widget */}
      {currentMilestone && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-bold text-text-main uppercase tracking-wider">Текущий этап</h2>
            <Badge variant="warning">В работе</Badge>
          </div>
          <Card hoverable onClick={() => navigate('/customer/orders')} variant="gradient">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-muted font-medium">{customerOrders[0].title}</p>
                <p className="text-base font-bold text-text-main mt-0.5">{currentMilestone.title}</p>
              </div>
              <div className="bg-primary/10 rounded-xl px-2.5 py-1.5 ml-2">
                <p className="text-xs font-bold text-primary">{formatMoney(currentMilestone.amount)}</p>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-[11px] text-text-muted mb-1.5 font-medium">
                <span>Прогресс работ</span>
                <span className="text-primary font-semibold">{completedMs}/{totalMs} этапов</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedMs / totalMs) * 100}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <ChevronRight size={16} className="text-text-muted" />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Orders list */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-text-main uppercase tracking-wider">Мои заказы</h2>
          <button className="text-xs text-primary font-semibold" onClick={() => navigate('/customer/orders')}>
            Все →
          </button>
        </div>
        <div className="space-y-2.5">
          {customerOrders.slice(0, 3).map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Card hoverable onClick={() => navigate('/customer/orders')}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    order.status === 'completed' ? 'bg-emerald-50' :
                    order.status === 'in_progress' ? 'bg-indigo-50' : 'bg-amber-50'
                  }`}>
                    <span className="text-lg">
                      {order.status === 'completed' ? '✅' : order.status === 'in_progress' ? '🔨' : '📋'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="font-semibold text-sm truncate text-text-main">{order.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-text-muted truncate">{order.address}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary">{formatMoney(order.totalBudget)}</p>
                    <Badge variant={statusVariants[order.status]} size="sm">{statusLabels[order.status]}</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Create order CTA */}
      <motion.div variants={item}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/customer/create-order')}
          className="w-full gradient-hero text-white font-bold text-sm py-4 rounded-2xl flex items-center justify-center gap-2.5 glow-primary"
        >
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
            <Plus size={18} className="text-white" />
          </div>
          Создать новый заказ
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

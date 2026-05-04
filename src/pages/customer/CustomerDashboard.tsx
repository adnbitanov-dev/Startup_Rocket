import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Clock, ChevronRight, Shield, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { customerOrders, customerEscrow, formatMoney, statusLabels, statusVariants } from '../../mock/data';
import { useNavigate } from 'react-router-dom';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const activeOrders = customerOrders.filter((o) => o.status !== 'completed');
  const currentMilestone = customerOrders[0]?.milestones.find((m) => m.status === 'in_progress');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-4">
      {/* Greeting */}
      <motion.div variants={item}>
        <p className="text-text-muted text-sm">Кабинет заказчика 👋</p>
        <h1 className="text-2xl font-bold text-text-main mt-0.5">Мои проекты</h1>
      </motion.div>

      {/* Escrow balance card */}
      <motion.div variants={item}>
        <Card className="bg-gradient-to-br from-primary to-blue-600 !border-0 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium flex items-center gap-1.5">
                <Shield size={14} /> Эскроу-счёт
              </p>
              <p className="text-3xl font-bold mt-2 tracking-tight">
                {formatMoney(customerEscrow.heldAmount)}
              </p>
              <p className="text-white/60 text-xs mt-1">
                защищено из {formatMoney(customerEscrow.totalAmount)}
              </p>
            </div>
            <div className="bg-white/15 rounded-xl p-2.5 backdrop-blur-sm">
              <Wallet size={24} />
            </div>
          </div>
          <div className="flex gap-4 mt-5 pt-4 border-t border-white/15">
            <div className="flex items-center gap-2">
              <div className="bg-white/15 rounded-lg p-1.5"><TrendingUp size={14} /></div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Выплачено</p>
                <p className="text-sm font-semibold">{formatMoney(customerEscrow.releasedAmount)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/15 rounded-lg p-1.5"><Clock size={14} /></div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Активных</p>
                <p className="text-sm font-semibold">{activeOrders.length} заказов</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Current milestone */}
      {currentMilestone && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-text-main">Текущий этап</h2>
            <Badge variant="warning">В работе</Badge>
          </div>
          <Card hoverable onClick={() => navigate('/customer/orders')}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-muted">{customerOrders[0].title}</p>
                <p className="text-base font-semibold mt-0.5">{currentMilestone.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-text-muted">💰 {formatMoney(currentMilestone.amount)}</span>
                  <span className="text-xs text-text-muted">📅 до {new Date(currentMilestone.deadline).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-text-muted" />
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-text-muted mb-1">
                <span>Прогресс</span>
                <span>{customerOrders[0].milestones.filter((m) => m.status === 'accepted').length}/{customerOrders[0].milestones.length} этапов</span>
              </div>
              <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(customerOrders[0].milestones.filter((m) => m.status === 'accepted').length / customerOrders[0].milestones.length) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Order list */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-text-main">Мои заказы</h2>
          <button className="text-sm text-primary font-medium" onClick={() => navigate('/customer/orders')}>Все →</button>
        </div>
        <div className="space-y-3">
          {customerOrders.map((order) => (
            <Card key={order.id} hoverable onClick={() => navigate('/customer/orders')}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">{order.title}</p>
                    <Badge variant={statusVariants[order.status]} size="sm">{statusLabels[order.status]}</Badge>
                  </div>
                  <p className="text-xs text-text-muted mt-1 truncate">{order.address}</p>
                  <p className="text-sm font-semibold text-primary mt-1.5">{formatMoney(order.totalBudget)}</p>
                </div>
                <ChevronRight size={18} className="text-text-muted flex-shrink-0 ml-2" />
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Create order */}
      <motion.div variants={item}>
        <Button fullWidth size="lg" icon={<Plus size={20} />}>Создать заказ</Button>
      </motion.div>
    </motion.div>
  );
}

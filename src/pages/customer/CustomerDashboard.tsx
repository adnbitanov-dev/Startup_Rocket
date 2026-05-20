import { motion } from 'framer-motion';
import { ChevronRight, Plus, Shield, Hammer, CheckCheck, MessageCircle, Banknote } from 'lucide-react';
import { customerEscrow, formatMoney, statusLabels } from '../../mock/data';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../store/DataContext';
import { useUser } from '../../store/UserContext';

const ease: [number, number, number, number] = [0.32, 0.72, 0, 1];
const stagger: any = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const pop: any = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } } };

function Widget({ children, className = '', span = 1, onClick }: {
  children: React.ReactNode; className?: string; span?: 1 | 2; onClick?: () => void;
}) {
  return (
    <motion.div
      variants={pop}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      onClick={onClick}
      className={`
        rounded-3xl p-5 relative overflow-hidden
        ${span === 2 ? 'col-span-2' : ''}
        ${onClick ? 'cursor-pointer active:brightness-[0.97] transition-all' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { customerOrders } = useData();
  const { userName } = useUser();
  const firstName = userName?.split(' ')[0] || 'Клиент';
  const activeOrders = customerOrders.filter((o) => o.status !== 'completed');
  const completedOrders = customerOrders.filter((o) => o.status === 'completed');
  const currentOrder = customerOrders.find(o => o.status === 'in_progress');
  const currentMilestone = currentOrder?.milestones.find((m) => m.status === 'in_progress');
  const completedMs = currentOrder?.milestones.filter(m => m.status === 'accepted').length || 0;
  const totalMs = currentOrder?.milestones.length || 1;
  const progressPct = Math.round((completedMs / totalMs) * 100);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="pb-8 -mx-4 px-4">

      <motion.div variants={pop} className="mb-5 px-1">
        <h1 className="text-[26px] font-extrabold text-text-main tracking-tight">
          Привет, {firstName}
        </h1>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">

        {/* ─── ESCROW ─── */}
        <Widget span={2} className="bg-[#1C1C1E] text-white min-h-[160px]">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/[0.03] blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} className="text-white/40" />
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.1em]">
                Эскроу-баланс
              </span>
            </div>
            <p className="text-[40px] font-extrabold tracking-tight leading-none">
              {formatMoney(customerEscrow.heldAmount)}
            </p>
            <p className="text-[13px] text-white/30 mt-1.5 font-medium">
              из {formatMoney(customerEscrow.totalAmount)} защищено
            </p>
            <div className="flex gap-8 mt-5">
              <div>
                <p className="text-[10px] text-white/25 uppercase tracking-wider font-semibold">Выплачено</p>
                <p className="text-[15px] font-bold text-white/70 mt-0.5">{formatMoney(customerEscrow.releasedAmount)}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/25 uppercase tracking-wider font-semibold">В работе</p>
                <p className="text-[15px] font-bold text-white/70 mt-0.5">{activeOrders.length} проектов</p>
              </div>
            </div>
          </div>
        </Widget>

        {/* ─── STATS ─── */}
        <Widget className="bg-[#F2F2F7] min-h-[120px]" onClick={() => navigate('/customer/orders')}>
          <div className="w-9 h-9 rounded-2xl bg-black/[0.05] flex items-center justify-center mb-3">
            <Hammer size={18} className="text-[#636366]" />
          </div>
          <p className="text-[32px] font-extrabold text-text-main leading-none">{activeOrders.length}</p>
          <p className="text-[12px] text-text-muted font-semibold mt-1">В работе</p>
        </Widget>

        <Widget className="bg-[#F2F2F7] min-h-[120px]" onClick={() => navigate('/customer/orders')}>
          <div className="w-9 h-9 rounded-2xl bg-black/[0.05] flex items-center justify-center mb-3">
            <CheckCheck size={18} className="text-[#636366]" />
          </div>
          <p className="text-[32px] font-extrabold text-text-main leading-none">{completedOrders.length}</p>
          <p className="text-[12px] text-text-muted font-semibold mt-1">Завершено</p>
        </Widget>

        {/* ─── CURRENT MILESTONE ─── */}
        {currentMilestone && currentOrder && (
          <Widget span={2} className="bg-[#F2F2F7]" onClick={() => navigate('/customer/orders')}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">
                Текущий этап
              </span>
              <span className="text-[13px] font-bold text-text-main">{formatMoney(currentMilestone.amount)}</span>
            </div>
            <p className="text-[11px] text-text-muted font-medium">{currentOrder.title}</p>
            <p className="text-[19px] font-bold text-text-main mt-0.5 leading-snug">{currentMilestone.title}</p>
            <div className="mt-4">
              <div className="h-[5px] bg-black/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#1D1D1F]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[11px] text-text-muted font-medium">{completedMs} из {totalMs} этапов</span>
                <span className="text-[11px] font-semibold text-text-main">{progressPct}%</span>
              </div>
            </div>
          </Widget>
        )}

        {/* ─── ORDERS LIST ─── */}
        <Widget span={2} className="bg-[#F2F2F7] !p-0">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">
              Мои проекты
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/customer/orders'); }}
              className="text-[12px] text-text-main font-semibold flex items-center gap-0.5"
            >
              Все <ChevronRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-black/[0.04]">
            {customerOrders.slice(0, 3).map((order) => {
              const isActive = order.status === 'in_progress';
              const isCompleted = order.status === 'completed';
              return (
                <motion.div
                  key={order.id}
                  whileTap={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  onClick={() => navigate('/customer/orders')}
                  className="flex items-center gap-3.5 px-5 py-3.5 cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-[#34C759]/10' : isActive ? 'bg-black/[0.05]' : 'bg-[#FF9F0A]/10'
                  }`}>
                    {isCompleted ? <CheckCheck size={17} className="text-[#34C759]" /> :
                     isActive ? <Hammer size={17} className="text-[#636366]" /> :
                     <Banknote size={17} className="text-[#FF9F0A]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-main truncate">{order.title}</p>
                    <p className="text-[12px] text-text-muted truncate mt-0.5">{order.address}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[14px] font-bold text-text-main">{formatMoney(order.totalBudget)}</p>
                    <p className={`text-[10px] font-semibold mt-0.5 ${
                      isCompleted ? 'text-[#34C759]' : isActive ? 'text-[#636366]' : 'text-[#FF9F0A]'
                    }`}>{statusLabels[order.status]}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Widget>

        {/* ─── QUICK ACTIONS ─── */}
        <Widget
          className="bg-[#1D1D1F] min-h-[100px]"
          onClick={() => navigate('/customer/create-order')}
        >
          <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center mb-3">
            <Plus size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <p className="text-[14px] font-bold text-white leading-snug">Новый проект</p>
          <p className="text-[11px] text-white/40 font-medium mt-0.5">Создать заказ</p>
        </Widget>

        <Widget
          className="bg-[#F2F2F7] min-h-[100px]"
          onClick={() => currentOrder ? navigate(`/chat/${currentOrder.id}`) : undefined}
        >
          <div className="w-9 h-9 rounded-2xl bg-black/[0.05] flex items-center justify-center mb-3">
            <MessageCircle size={18} className="text-[#636366]" />
          </div>
          <p className="text-[14px] font-bold text-text-main leading-snug">Сообщения</p>
          <p className="text-[11px] text-text-muted font-medium mt-0.5">2 новых</p>
        </Widget>

      </div>
    </motion.div>
  );
}

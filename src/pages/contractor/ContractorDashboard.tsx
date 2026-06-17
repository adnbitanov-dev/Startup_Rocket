import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Star, Briefcase, ChevronRight, Search, Award, Zap } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { contractorEarnings, formatMoney, statusLabels, statusVariants } from '../../mock/data';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../store/DataContext';
import { useUser } from '../../store/UserContext';

const container: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } } };

export default function ContractorDashboard() {
  const navigate = useNavigate();
  const { contractorActiveJobs } = useData();
  const { userName } = useUser();
  const firstName = userName?.split(' ')[0] || 'Мастер';
  const currentJob = contractorActiveJobs[0];
  const currentMilestone = currentJob?.milestones.find(m => m.status === 'in_progress');
  const completedMs = currentJob?.milestones.filter(m => m.status === 'accepted').length || 0;
  const totalMs = currentJob?.milestones.length || 1;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="pb-8 -mx-4 px-4">

      <motion.div variants={item} className="mb-5 px-1">
        <h1 className="text-[26px] font-extrabold text-text-main tracking-tight">
          Привет, {firstName}
        </h1>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">

        {/* Earnings hero */}
        <motion.div variants={item} className="col-span-2">
          <div className="relative overflow-hidden rounded-3xl p-5 bg-[#1C1C1E] text-white min-h-[160px]">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/[0.03] blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Wallet size={14} className="text-white/40" />
                <span className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.1em]">
                  Мой заработок
                </span>
              </div>
              <p className="text-[40px] font-extrabold tracking-tight leading-none">
                {formatMoney(contractorEarnings.totalEarned)}
              </p>
              <p className="text-[13px] text-white/30 mt-1.5 font-medium">
                ожидает: {formatMoney(contractorEarnings.pendingPayment)}
              </p>
              <div className="flex gap-8 mt-5">
                <div>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider font-semibold">Рейтинг</p>
                  <p className="text-[15px] font-bold text-white/70 mt-0.5">⭐ {contractorEarnings.rating}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider font-semibold">Выполнено</p>
                  <p className="text-[15px] font-bold text-white/70 mt-0.5">{contractorEarnings.reviewCount} работ</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        {[
          { icon: <Zap size={18} className="text-[#636366]" />, value: contractorActiveJobs.length, label: 'Активных' },
          { icon: <Star size={18} className="text-[#636366]" />, value: contractorEarnings.rating, label: 'Рейтинг' },
          { icon: <Award size={18} className="text-[#636366]" />, value: contractorEarnings.reviewCount, label: 'Отзывов' },
        ].map((s, i) => (
          <motion.div
            key={i}
            variants={item}
            className={`rounded-3xl p-5 bg-[#F2F2F7] ${i === 2 ? 'col-span-2' : ''}`}
          >
            <div className="w-9 h-9 rounded-2xl bg-black/[0.05] flex items-center justify-center mb-3">
              {s.icon}
            </div>
            <p className="text-[32px] font-extrabold text-text-main leading-none">{s.value}</p>
            <p className="text-[12px] text-text-muted font-semibold mt-1">{s.label}</p>
          </motion.div>
        ))}

        {/* Current milestone */}
        {currentMilestone && currentJob && (
          <motion.div variants={item} className="col-span-2">
            <div
              className="rounded-3xl p-5 bg-[#F2F2F7] cursor-pointer"
              onClick={() => navigate('/contractor/jobs')}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">
                  Текущий этап
                </span>
                <span className="text-[13px] font-bold text-text-main">{formatMoney(currentMilestone.amount)}</span>
              </div>
              <p className="text-[11px] text-text-muted font-medium">{currentJob.title}</p>
              <p className="text-[19px] font-bold text-text-main mt-0.5 leading-snug">{currentMilestone.title}</p>
              <div className="mt-4">
                <div className="h-[5px] bg-black/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#1D1D1F]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedMs / totalMs) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[11px] text-text-muted font-medium">{completedMs} из {totalMs} этапов</span>
                  <span className="text-[11px] font-semibold text-text-main">{Math.round((completedMs / totalMs) * 100)}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Jobs list */}
        <motion.div variants={item} className="col-span-2">
          <div className="rounded-3xl bg-[#F2F2F7] overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">Мои работы</span>
              <button className="text-[12px] text-text-main font-semibold flex items-center gap-0.5" onClick={() => navigate('/contractor/jobs')}>
                Все <ChevronRight size={13} />
              </button>
            </div>
            <div className="divide-y divide-black/[0.04]">
              {contractorActiveJobs.slice(0, 3).map((job) => (
                <motion.div
                  key={job.id}
                  whileTap={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  onClick={() => navigate('/contractor/jobs')}
                  className="flex items-center gap-3.5 px-5 py-3.5 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-black/[0.05] flex items-center justify-center flex-shrink-0">
                    <Briefcase size={17} className="text-[#636366]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-main truncate">{job.title}</p>
                    <p className="text-[12px] text-text-muted truncate mt-0.5">{job.address}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[14px] font-bold text-text-main">{formatMoney(job.totalBudget)}</p>
                    <Badge variant={statusVariants[job.status]} size="sm">{statusLabels[job.status]}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Find orders CTA */}
        <motion.div variants={item} className="col-span-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/contractor/feed')}
            className="w-full py-4 rounded-3xl flex items-center justify-center gap-2.5 text-[14px] font-bold bg-[#1D1D1F] text-white"
          >
            <Search size={18} />
            Найти новые заказы
          </motion.button>
        </motion.div>

      </div>
    </motion.div>
  );
}

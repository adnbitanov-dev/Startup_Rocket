import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Camera, MapPin } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatMoney, formatDate, statusLabels, statusVariants } from '../../mock/data';
import { useData } from '../../store/DataContext';

const container: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item: any = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

const milestoneIcons: Record<string, React.ReactNode> = {
  accepted: <CheckCircle2 size={18} className="text-success" />,
  in_progress: <Clock size={18} className="text-warning" />,
  pending: <Clock size={18} className="text-text-muted" />,
};

export default function ContractorJobs() {
  const { contractorActiveJobs } = useData();
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-4">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-main">Мои работы</h1>
        <p className="text-sm text-text-muted mt-0.5">
          {contractorActiveJobs.length} активных работ
        </p>
      </motion.div>

      {contractorActiveJobs.map((job) => {
        const completedMs = job.milestones.filter(m => m.status === 'accepted').length;
        const progress = (completedMs / job.milestones.length) * 100;

        return (
          <motion.div key={job.id} variants={item}>
            <Card>
              {/* Job header */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-lg text-text-main">{job.title}</h3>
                <Badge variant={statusVariants[job.status]} size="sm">{statusLabels[job.status]}</Badge>
              </div>
              <p className="flex items-center gap-1 text-xs text-text-muted mb-3">
                <MapPin size={12} /> {job.address}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-[11px] text-text-muted mb-1">
                  <span>Общий прогресс</span>
                  <span>{completedMs}/{job.milestones.length} этапов</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Milestones timeline */}
              <div className="space-y-2">
                {job.milestones.map((ms, idx) => {
                  const isActive = ms.status === 'in_progress';
                  return (
                    <div
                      key={ms.id}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                        isActive ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50/60'
                      }`}
                    >
                      <div className="relative mt-0.5">
                        {milestoneIcons[ms.status] || milestoneIcons.pending}
                        {idx < job.milestones.length - 1 && (
                          <div className="absolute left-[8px] top-[22px] w-0.5 h-5 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${isActive ? 'text-amber-800' : ''}`}>{ms.title}</p>
                          <Badge variant={statusVariants[ms.status]} size="sm">{statusLabels[ms.status]}</Badge>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">{ms.description}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs font-medium text-success">{formatMoney(ms.amount)}</span>
                          <span className="text-xs text-text-muted">до {formatDate(ms.deadline)}</span>
                        </div>

                        {/* Actions for active milestone */}
                        {isActive && (
                          <div className="flex gap-2 mt-3">
                            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors">
                              <Camera size={14} /> Фото "до/после"
                            </button>
                            <button className="px-3 py-2 rounded-lg bg-success text-white text-xs font-semibold hover:bg-green-600 transition-colors">
                              Завершить этап ✓
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Earnings summary */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted">Общий бюджет</p>
                  <p className="text-base font-bold text-text-main">{formatMoney(job.totalBudget)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-muted">Получено</p>
                  <p className="text-base font-bold text-success">
                    {formatMoney(job.milestones.filter(m => m.status === 'accepted').reduce((sum, m) => sum + m.amount, 0))}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

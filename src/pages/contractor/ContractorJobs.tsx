import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, MessageSquare, AlertCircle, CheckCircle2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import FaceIdModal from '../../components/ui/FaceIdModal';
import { formatMoney, formatDate, statusLabels, statusVariants } from '../../mock/data';
import { useData } from '../../store/DataContext';

const container: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item: any = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };



export default function ContractorJobs() {
  const navigate = useNavigate();
  const { contractorActiveJobs, updateMilestoneStatus } = useData();
  const [uploadingMsId, setUploadingMsId] = useState<string | null>(null);
  const [showFaceId, setShowFaceId] = useState(false);
  const [fixingMs, setFixingMs] = useState<{ orderId: string; msId: string } | null>(null);

  const handleCompletePhase = async (orderId: string, milestoneId: string) => {
    setUploadingMsId(milestoneId);
    // Mock upload delay
    await new Promise(r => setTimeout(r, 1500));
    
    // Mock photos
    const mockPhotos = {
      before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
      after: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=400'
    };

    updateMilestoneStatus(orderId, milestoneId, 'review', mockPhotos);
    setUploadingMsId(null);
  };

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
              <div className="flex items-center justify-between mb-3">
                <p className="flex items-center gap-1 text-xs text-text-muted">
                  <MapPin size={12} /> {job.address}
                </p>
                <button 
                  onClick={() => navigate(`/chat/${job.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-primary text-xs font-medium hover:bg-blue-100 transition-colors"
                >
                  <MessageSquare size={14} /> Чат с заказчиком
                </button>
              </div>

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

              {/* Completed banner */}
              {job.status === 'completed' && (
                <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center">
                      <CheckCircle2 size={22} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-success">Работы успешно завершены!</p>
                      <p className="text-xs text-text-muted">Получено: {formatMoney(job.milestones.reduce((s, m) => s + m.amount, 0))}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-text-muted mr-1">Ваш рейтинг:</p>
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={18} className="text-warning fill-warning" />
                    ))}
                  </div>
                </div>
              )}

              {/* Milestones timeline */}
              <div className="space-y-2">
                {job.milestones.map((ms) => {
                  const isCompleted = ms.status === 'accepted';
                  const isCurrent = ms.status === 'in_progress';
                  const isReview = ms.status === 'review';

                  return (
                    <div key={ms.id} className="relative pl-6">
                      {/* Timeline dot */}
                      <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 bg-white z-10 ${
                        isCompleted ? 'border-success' : isCurrent ? 'border-primary' : isReview ? 'border-warning' : 'border-gray-300'
                      }`} />
                      
                      <div className={`mb-1 flex items-center justify-between ${!isCompleted && !isCurrent && !isReview ? 'opacity-50' : ''}`}>
                        <h4 className={`font-semibold ${isCompleted ? 'text-success' : 'text-text-main'}`}>
                          {ms.title}
                        </h4>
                        <Badge variant={statusVariants[ms.status]} size="sm">
                          {statusLabels[ms.status]}
                        </Badge>
                      </div>
                      
                      <p className={`text-sm mb-2 ${!isCompleted && !isCurrent && !isReview ? 'opacity-50 text-text-muted' : 'text-text-muted'}`}>
                        {ms.description}
                      </p>
                      
                      <div className={`flex items-center gap-3 text-xs mb-3 ${!isCompleted && !isCurrent && !isReview ? 'opacity-50' : ''}`}>
                        <span className="font-semibold text-text-main">{formatMoney(ms.amount)}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-text-muted">до {formatDate(ms.deadline)}</span>
                      </div>

                      {isCurrent && (
                        <div className="mt-3 p-3 bg-secondary rounded-xl flex gap-2">
                          <Button 
                            className="flex-1" 
                            variant="primary" 
                            icon={uploadingMsId === ms.id ? undefined : <Camera size={16} />}
                            onClick={() => handleCompletePhase(job.id, ms.id)}
                            disabled={uploadingMsId === ms.id}
                          >
                            {uploadingMsId === ms.id ? 'Загрузка...' : 'Сдать этап (Фото)'}
                          </Button>
                        </div>
                      )}

                      {ms.status === 'disputed' && (
                        <div className="mt-3 p-3 bg-danger/10 rounded-xl space-y-2">
                          <p className="text-xs text-danger font-medium">
                            ⚠️ Заказчик не принял работу. Открыт спор.
                          </p>
                          <Button 
                            variant="outline"
                            className="w-full !border-danger !text-danger hover:!bg-danger/5" 
                            icon={<AlertCircle size={16} />}
                            onClick={() => navigate(`/dispute/${job.id}`)}
                          >
                            Перейти в арбитраж
                          </Button>
                          <Button 
                            className="w-full" 
                            icon={<CheckCircle2 size={16} />}
                            onClick={() => {
                              setFixingMs({ orderId: job.id, msId: ms.id });
                              setShowFaceId(true);
                            }}
                          >
                            Работы исправлены
                          </Button>
                        </div>
                      )}
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

      <FaceIdModal
        isOpen={showFaceId}
        onSuccess={() => {
          if (fixingMs) {
            updateMilestoneStatus(fixingMs.orderId, fixingMs.msId, 'review');
            setFixingMs(null);
          }
          setShowFaceId(false);
        }}
      />
    </motion.div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FaceIdModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export default function FaceIdModal({ isOpen, onSuccess }: FaceIdModalProps) {
  const [status, setStatus] = useState<'scanning' | 'success'>('scanning');

  useEffect(() => {
    if (isOpen) {
      setStatus('scanning');
      const timer = setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
          onSuccess();
        }, 800);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onSuccess]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-48 h-48 bg-white/10 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center shadow-2xl border border-white/20"
          >
            {status === 'scanning' ? (
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-white"
              >
                <ScanFace size={64} strokeWidth={1.5} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-success"
              >
                <CheckCircle2 size={64} strokeWidth={2} />
              </motion.div>
            )}
            <p className="text-white mt-4 font-medium">
              {status === 'scanning' ? 'Face ID' : 'Подтверждено'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

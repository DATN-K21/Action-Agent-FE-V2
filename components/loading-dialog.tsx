import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

export interface ILoadingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}

function LoadingDialog({ title, description, isOpen, onClose }: ILoadingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="w-[350px] md:w-[420px] max-h-[80vh] min-h-[250px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">{title}</DialogTitle>
            </DialogHeader>
            <motion.div
              className="flex flex-col gap-4 justify-between items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="animate-spin rounded-full size-12 border-y-2 border-gray-400"></div>
              {description && <DialogDescription>{description}</DialogDescription>}
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

export default LoadingDialog;

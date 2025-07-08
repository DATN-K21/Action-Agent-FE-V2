import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface ILoadingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}

function LoadingDialog({ title, description, isOpen, onClose }: ILoadingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[350px] md:w-[420px] max-h-[80vh] min-h-[250px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 justify-between items-center">
          {/* Add a spinner effect */}
          <div className="animate-spin rounded-full size-12 border-y-2 border-gray-400"></div>

          {/* Optional description */}
          {description && <DialogDescription>{description}</DialogDescription>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoadingDialog;

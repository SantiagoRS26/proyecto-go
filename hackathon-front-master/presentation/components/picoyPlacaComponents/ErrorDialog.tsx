import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onConfirm: () => void;
  isError: boolean;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ isOpen, onClose, message, onConfirm ,isError}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
            <DialogTitle>{isError ? 'Error en el registro' : 'Registro correctamente'}</DialogTitle>
        </DialogHeader>
        <p>{message}</p>
        <DialogClose asChild>
          <Button onClick={onConfirm}>Aceptar</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorDialog;
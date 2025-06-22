
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  changes: Record<string, string>;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  changes,
  isLoading = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-orange-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-700">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Dados que serão alterados:</h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            {Object.entries(changes).map(([field, value]) => (
              <div key={field} className="flex justify-between">
                <span className="font-medium text-gray-600">{field}:</span>
                <span className="text-gray-900">{value || '(vazio)'}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex space-x-2 mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Salvando...' : 'Confirmar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;

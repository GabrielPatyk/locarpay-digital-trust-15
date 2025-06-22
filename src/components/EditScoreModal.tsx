
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Save, X } from 'lucide-react';

interface EditScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
  currentTaxa: number;
  onSave: (score: number, taxa: number) => void;
  isLoading?: boolean;
}

const EditScoreModal: React.FC<EditScoreModalProps> = ({
  isOpen,
  onClose,
  currentScore,
  currentTaxa,
  onSave,
  isLoading = false
}) => {
  const [score, setScore] = useState(currentScore);
  const [taxa, setTaxa] = useState(currentTaxa);

  const handleSave = () => {
    onSave(score, taxa);
    onClose();
  };

  const resetValues = () => {
    setScore(currentScore);
    setTaxa(currentTaxa);
  };

  React.useEffect(() => {
    if (isOpen) {
      setScore(currentScore);
      setTaxa(currentTaxa);
    }
  }, [isOpen, currentScore, currentTaxa]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Score e Taxa
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="score">Score de Crédito</Label>
            <Input
              id="score"
              type="number"
              min="300"
              max="900"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              placeholder="Score (300-900)"
            />
            <p className="text-xs text-gray-500 mt-1">Score entre 300 e 900 pontos</p>
          </div>
          
          <div>
            <Label htmlFor="taxa">Taxa Aplicada (%)</Label>
            <Input
              id="taxa"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={taxa}
              onChange={(e) => setTaxa(Number(e.target.value))}
              placeholder="Taxa (%)"
            />
            <p className="text-xs text-gray-500 mt-1">Taxa em porcentagem</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              resetValues();
              onClose();
            }}
            disabled={isLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditScoreModal;

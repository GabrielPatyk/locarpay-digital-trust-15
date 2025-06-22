
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';

interface InactivityWarningModalProps {
  isOpen: boolean;
  onExtendSession: () => void;
  onLogout: () => void;
  warningTimeSeconds?: number;
}

const InactivityWarningModal: React.FC<InactivityWarningModalProps> = ({
  isOpen,
  onExtendSession,
  onLogout,
  warningTimeSeconds = 300 // 5 minutos por padrão
}) => {
  const [countdown, setCountdown] = useState(warningTimeSeconds);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(warningTimeSeconds);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, warningTimeSeconds, onLogout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = () => {
    onExtendSession();
    setCountdown(warningTimeSeconds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Sessão Inativa
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-4">
              <Clock className="h-12 w-12 mx-auto text-warning mb-2" />
              <p className="text-lg font-semibold text-gray-900">
                Você está inativo há algum tempo
              </p>
              <p className="text-gray-600 mt-2">
                Deseja continuar logado?
              </p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                Sua sessão será encerrada automaticamente em:
              </p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {formatTime(countdown)}
              </p>
            </div>
            
            <p className="text-xs text-gray-500">
              Se não responder, você será desconectado automaticamente por segurança.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleExtendSession}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Sim, continuar logado
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex-1"
            >
              Fazer logout agora
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InactivityWarningModal;


import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, LogOut } from 'lucide-react';

interface InactivityWarningModalProps {
  isOpen: boolean;
  onStayLoggedIn: () => void;
  onLogout: () => void;
  countdownSeconds?: number;
}

const InactivityWarningModal: React.FC<InactivityWarningModalProps> = ({
  isOpen,
  onStayLoggedIn,
  onLogout,
  countdownSeconds = 300 // 5 minutos
}) => {
  const [timeLeft, setTimeLeft] = useState(countdownSeconds);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(countdownSeconds);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, countdownSeconds, onLogout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Sessão Inativa
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-4">
              <Clock className="h-12 w-12 mx-auto text-orange-500" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Você está inativo. Deseja continuar logado?
            </p>
            <p className="text-sm text-gray-600">
              Sua sessão expirará automaticamente em:
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-orange-700">
                minutos restantes
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onStayLoggedIn}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Clock className="mr-2 h-4 w-4" />
              Sim, continuar logado
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Fazer logout agora
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Qualquer interação com o sistema reiniciará automaticamente sua sessão.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InactivityWarningModal;

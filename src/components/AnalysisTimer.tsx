
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface AnalysisTimerProps {
  createdAt: string;
  onExpired?: () => void;
}

const AnalysisTimer: React.FC<AnalysisTimerProps> = ({ createdAt, onExpired }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdTime = new Date(createdAt).getTime();
      const now = new Date().getTime();
      const tenMinutes = 10 * 60 * 1000; // 10 minutos em millisegundos
      const expireTime = createdTime + tenMinutes;
      const remaining = expireTime - now;

      if (remaining <= 0) {
        setIsExpired(true);
        setTimeLeft(0);
        if (onExpired) {
          onExpired();
        }
        return 0;
      }

      setIsExpired(false);
      return remaining;
    };

    // Calcular tempo inicial
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);

    // Atualizar a cada segundo
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, onExpired]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isExpired) {
    return (
      <div className="flex items-center gap-1 text-red-600 animate-pulse">
        <Clock className="h-3 w-3 animate-bounce" />
        <span className="text-xs font-bold animate-pulse">
          EXPIRADO
        </span>
      </div>
    );
  }

  const isUrgent = timeLeft < 2 * 60 * 1000; // Últimos 2 minutos

  return (
    <div className={`flex items-center gap-1 ${
      isUrgent ? 'text-red-600 animate-pulse' : 'text-orange-600'
    }`}>
      <Clock className={`h-3 w-3 ${isUrgent ? 'animate-bounce' : ''}`} />
      <span className={`text-xs font-medium ${isUrgent ? 'animate-pulse' : ''}`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default AnalysisTimer;

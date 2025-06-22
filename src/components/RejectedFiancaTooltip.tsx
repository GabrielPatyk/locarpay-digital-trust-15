
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, User, Calendar, Star } from 'lucide-react';

interface RejectedFiancaTooltipProps {
  children: React.ReactNode;
  rejectionReason: string;
  rejectionDate: string;
  score: number | null;
  analystName: string;
}

const RejectedFiancaTooltip: React.FC<RejectedFiancaTooltipProps> = ({
  children,
  rejectionReason,
  rejectionDate,
  score,
  analystName,
}) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          align="center"
          className="max-w-sm p-4 bg-white border border-red-200 shadow-lg z-50"
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="font-semibold text-red-700">Fiança Rejeitada</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-medium text-gray-700">Motivo:</p>
                <p className="text-gray-600">{rejectionReason}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">
                  Rejeitada em: {new Date(rejectionDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              {score && (
                <div className="flex items-center space-x-2">
                  <Star className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Score: {score}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <User className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">Analista: {analystName}</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RejectedFiancaTooltip;

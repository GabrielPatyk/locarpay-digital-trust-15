
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User, Calendar, Star, DollarSign } from 'lucide-react';

interface ApprovedFiancaTooltipProps {
  children: React.ReactNode;
  approvalDate: string;
  score: number | null;
  rate: number | null;
  analystName: string;
  observations?: string;
}

const ApprovedFiancaTooltip: React.FC<ApprovedFiancaTooltipProps> = ({
  children,
  approvalDate,
  score,
  rate,
  analystName,
  observations,
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
          className="max-w-sm p-4 bg-white border border-green-200 shadow-lg z-50"
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="font-semibold text-green-700">Fiança Aprovada</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-medium text-gray-700">Observação:</p>
                <p className="text-gray-600">
                  {observations || 'Aguardando Aceite da Imobiliária/Inquilino'}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">
                  Aprovada em: {new Date(approvalDate).toLocaleDateString('pt-BR', {
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
              
              {rate && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Taxa: {rate}%</span>
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

export default ApprovedFiancaTooltip;

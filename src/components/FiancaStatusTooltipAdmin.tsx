
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

interface FiancaStatusTooltipAdminProps {
  status: string;
  motivoReprovacao?: string;
  dataAnalise?: string;
  analisadoPor?: string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const FiancaStatusTooltipAdmin = ({
  status,
  motivoReprovacao,
  dataAnalise,
  analisadoPor,
  getStatusColor,
  getStatusLabel
}: FiancaStatusTooltipAdminProps) => {
  const getTooltipContent = () => {
    let content = `Status atual: ${getStatusLabel(status)}`;
    
    if (dataAnalise) {
      content += `\nData: ${new Date(dataAnalise).toLocaleDateString('pt-BR')}`;
    }
    
    if (analisadoPor) {
      content += `\nAnalista: ${analisadoPor}`;
    }
    
    if (motivoReprovacao && status === 'rejeitada') {
      content += `\nMotivo: ${motivoReprovacao}`;
    }
    
    return content;
  };

  const hasTooltipInfo = motivoReprovacao || dataAnalise || analisadoPor;

  if (!hasTooltipInfo) {
    return (
      <Badge className={getStatusColor(status)}>
        {getStatusLabel(status)}
      </Badge>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${getStatusColor(status)} cursor-help`}>
            {getStatusLabel(status)}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">Status: {getStatusLabel(status)}</p>
            
            {dataAnalise && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{new Date(dataAnalise).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            
            {analisadoPor && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span>{analisadoPor}</span>
              </div>
            )}
            
            {motivoReprovacao && status === 'rejeitada' && (
              <div className="text-sm">
                <p className="font-medium text-red-600">Motivo da reprovação:</p>
                <p className="text-red-700">{motivoReprovacao}</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FiancaStatusTooltipAdmin;

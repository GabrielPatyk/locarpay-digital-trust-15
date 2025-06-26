
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, AlertCircle } from 'lucide-react';

interface FiancaStatusTooltipProps {
  status: string;
  motivo_reprovacao?: string | null;
  data_atualizacao: string;
  analista?: string | null;
  children: React.ReactNode;
}

const FiancaStatusTooltip: React.FC<FiancaStatusTooltipProps> = ({
  status,
  motivo_reprovacao,
  data_atualizacao,
  analista,
  children
}) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'aprovada': return 'Aprovada';
      case 'em_analise': return 'Em Análise';
      case 'enviada_ao_financeiro': return 'Enviada ao Financeiro';
      case 'rejeitada': return 'Rejeitada';
      case 'vencida': return 'Vencida';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <h4 className="font-medium">Status da Fiança</h4>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status atual:</span>
              <Badge variant="outline">{getStatusLabel(status)}</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span className="text-gray-600">
                Atualizado em: {new Date(data_atualizacao).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            {analista && (
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">Analista: {analista}</span>
              </div>
            )}
            
            {status === 'rejeitada' && motivo_reprovacao && (
              <div className="mt-3 p-2 bg-red-50 rounded border-l-2 border-red-200">
                <p className="text-sm font-medium text-red-800 mb-1">Motivo da reprovação:</p>
                <p className="text-sm text-red-700">{motivo_reprovacao}</p>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FiancaStatusTooltip;

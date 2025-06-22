
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

interface AguardandoPagamentoTooltipProps {
  children: React.ReactNode;
  approvalDate?: string | null;
  paymentDetails?: {
    metodo_pagamento?: string | null;
    prazo_pagamento?: string | null;
    situacao_pagamento?: string | null;
  };
}

const AguardandoPagamentoTooltip = ({ 
  children, 
  approvalDate,
  paymentDetails = {}
}: AguardandoPagamentoTooltipProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não informada';
    
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4 bg-white border border-gray-200 shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b pb-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="font-semibold text-gray-900">Aguardando Pagamento</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3 text-gray-500" />
                <span className="text-gray-600">Aprovada em:</span>
                <span className="font-medium">{formatDate(approvalDate)}</span>
              </div>
              
              {paymentDetails.metodo_pagamento && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600">Método:</span>
                  <span className="font-medium">{paymentDetails.metodo_pagamento}</span>
                </div>
              )}
              
              {paymentDetails.prazo_pagamento && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600">Prazo:</span>
                  <span className="font-medium">{paymentDetails.prazo_pagamento}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-3 w-3 text-gray-500" />
                <span className="text-gray-600">Situação:</span>
                <span className="font-medium text-yellow-600">
                  {paymentDetails.situacao_pagamento || 'Aguardando Link de Pagamento'}
                </span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 pt-2 border-t">
              Link de pagamento será disponibilizado pelo setor financeiro
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AguardandoPagamentoTooltip;

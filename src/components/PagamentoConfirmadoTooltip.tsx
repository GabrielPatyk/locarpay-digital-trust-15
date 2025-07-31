import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, CreditCard, FileText } from 'lucide-react';

interface PagamentoConfirmadoTooltipProps {
  children: React.ReactNode;
  dataConfirmacao: string;
  valorFianca: number;
  nomeInquilino: string;
}

const PagamentoConfirmadoTooltip = ({ 
  children, 
  dataConfirmacao,
  valorFianca,
  nomeInquilino
}: PagamentoConfirmadoTooltipProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <h4 className="font-semibold text-sm">Pagamento Confirmado</h4>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-700">
                  O pagamento da fiança para <strong>{nomeInquilino}</strong> foi confirmado com sucesso.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Valor: <strong>R$ {valorFianca.toLocaleString('pt-BR')}</strong></span>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                Confirmado em: {new Date(dataConfirmacao).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              <strong>Próximos passos:</strong> O contrato será gerado automaticamente e enviado para assinatura. Você receberá uma notificação em breve.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PagamentoConfirmadoTooltip;
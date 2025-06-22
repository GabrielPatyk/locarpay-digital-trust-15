
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CreditCard, Info } from 'lucide-react';

interface AguardandoPagamentoTooltipProps {
  children: React.ReactNode;
  linkEnviado?: string;
  dataEnvio?: string;
  valorFianca: number;
  nomeInquilino: string;
}

const AguardandoPagamentoTooltip = ({ 
  children, 
  linkEnviado,
  dataEnvio,
  valorFianca,
  nomeInquilino
}: AguardandoPagamentoTooltipProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            <h4 className="font-semibold text-sm">Aguardando Pagamento</h4>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-700">
                  A fiança está aguardando o pagamento do inquilino. O link foi enviado para a conta de <strong>{nomeInquilino}</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Valor: <strong>R$ {valorFianca.toLocaleString('pt-BR')}</strong></span>
            </div>

            {dataEnvio && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  Link enviado: {new Date(dataEnvio).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              <strong>Próximos passos:</strong> Peça ao inquilino para acessar a conta dele e efetuar o pagamento da fiança para que o status seja atualizado automaticamente.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AguardandoPagamentoTooltip;

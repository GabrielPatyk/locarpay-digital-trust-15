import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Info, CheckCircle } from 'lucide-react';

interface EmAnaliseTooltipProps {
  children: React.ReactNode;
  dataCriacao: string;
  nomeInquilino: string;
}

const EmAnaliseTooltip = ({ 
  children, 
  dataCriacao,
  nomeInquilino
}: EmAnaliseTooltipProps) => {
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
          className="max-w-sm p-4 bg-white border border-blue-200 shadow-lg z-50"
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-sm">Em Análise</h4>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">
                    A fiança para <strong>{nomeInquilino}</strong> foi criada e está aguardando análise interna pela nossa equipe.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-600">
                  Criada em: {new Date(dataCriacao).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">
                <strong>Próximos passos:</strong> Nossa equipe analisará a documentação e perfil de crédito. Você será notificado quando a análise for concluída.
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EmAnaliseTooltip;

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, DollarSign } from 'lucide-react';

interface FiancaAnalise {
  id: string;
  inquilino_nome_completo: string;
  inquilino_cpf: string;
  score_credito: number | null;
  taxa_aplicada: number | null;
  imovel_valor_aluguel: number;
  valor_fianca: number | null;
  data_aprovacao: string | null;
  imovel_endereco: string;
  imovel_numero: string;
  imovel_cidade: string;
  imobiliaria?: {
    nome: string;
  };
}

interface RelatorioAnalistaCardProps {
  fianca: FiancaAnalise;
}

const RelatorioAnalistaCard = ({ fianca }: RelatorioAnalistaCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{fianca.inquilino_nome_completo}</CardTitle>
            <CardDescription>{fianca.inquilino_cpf}</CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Aprovada
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Data Aprovação:</span>
              <span className="ml-1 font-medium">
                {fianca.data_aprovacao ? new Date(fianca.data_aprovacao).toLocaleDateString('pt-BR') : 'N/A'}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Score de Crédito:</span>
              <span className="ml-1 font-medium">{fianca.score_credito || 'N/A'}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Taxa Aplicada:</span>
              <span className="ml-1 font-medium">{fianca.taxa_aplicada ? `${fianca.taxa_aplicada}%` : 'N/A'}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <DollarSign className="mr-2 h-4 w-4 text-green-600" />
              <span className="text-gray-600">Valor Aluguel:</span>
              <span className="ml-1 font-medium text-green-600">
                R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Valor Fiança:</span>
              <span className="ml-1 font-medium">
                R$ {fianca.valor_fianca ? fianca.valor_fianca.toLocaleString('pt-BR') : 'N/A'}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Imobiliária:</span>
              <span className="ml-1 font-medium">{fianca.imobiliaria?.nome || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Endereço:</span> {fianca.imovel_endereco}, {fianca.imovel_numero} - {fianca.imovel_cidade}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatorioAnalistaCard;

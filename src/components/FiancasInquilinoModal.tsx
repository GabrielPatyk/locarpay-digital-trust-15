
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Calendar, CreditCard, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { InquilinoFianca } from '@/hooks/useInquilinosImobiliaria';

interface FiancasInquilinoModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquilino: InquilinoFianca | null;
}

const FiancasInquilinoModal = ({ isOpen, onClose, inquilino }: FiancasInquilinoModalProps) => {
  const { user } = useAuth();

  const { data: fiancas = [], isLoading } = useQuery({
    queryKey: ['fiancas-inquilino', inquilino?.cpf, user?.id],
    queryFn: async () => {
      if (!inquilino?.cpf || !user?.id) return [];

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select(`
          id,
          status_fianca,
          imovel_valor_aluguel,
          imovel_endereco,
          imovel_cidade,
          imovel_estado,
          data_criacao,
          data_vencimento
        `)
        .eq('inquilino_cpf', inquilino.cpf)
        .eq('id_imobiliaria', user.id)
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!inquilino?.cpf && !!user?.id && isOpen
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800';
      case 'aprovada': return 'bg-blue-100 text-blue-800';
      case 'em_analise': return 'bg-yellow-100 text-yellow-800';
      case 'enviada_ao_financeiro': return 'bg-purple-100 text-purple-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      case 'vencida': return 'bg-gray-100 text-gray-800';
      case 'cancelada': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

  if (!inquilino) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Fianças de {inquilino.nome}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : fiancas.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Nenhuma fiança encontrada para este inquilino.</p>
            </div>
          ) : (
            fiancas.map((fianca) => (
              <Card key={fianca.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Fiança #{fianca.id.slice(0, 8)}</h3>
                        <Badge className={getStatusColor(fianca.status_fianca)}>
                          {getStatusLabel(fianca.status_fianca)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Valor do Aluguel</p>
                      <p className="text-xl font-bold text-primary">
                        R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {fianca.imovel_endereco}, {fianca.imovel_cidade} - {fianca.imovel_estado}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Criada em: {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {fianca.data_vencimento && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Vencimento: {new Date(fianca.data_vencimento).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FiancasInquilinoModal;

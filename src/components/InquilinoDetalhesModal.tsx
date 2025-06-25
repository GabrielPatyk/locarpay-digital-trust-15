
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, FileText, Calendar, CreditCard } from 'lucide-react';
import { InquilinoFianca } from '@/hooks/useInquilinosImobiliaria';

interface InquilinoDetalhesModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquilino: InquilinoFianca | null;
}

const InquilinoDetalhesModal = ({ isOpen, onClose, inquilino }: InquilinoDetalhesModalProps) => {
  if (!inquilino) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Inquilino
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                  <p className="text-lg font-semibold">{inquilino.nome}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">CPF</label>
                  <p className="text-lg font-semibold">{inquilino.cpf}</p>
                </div>
                {inquilino.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">E-mail</label>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {inquilino.email}
                    </p>
                  </div>
                )}
                {inquilino.telefone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefone</label>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {inquilino.telefone}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Badge className={inquilino.statusAtivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {inquilino.statusAtivo ? 'Ativo' : 'Inativo'}
                </Badge>
                <Badge className={inquilino.statusVerificacao === 'verificado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {inquilino.statusVerificacao === 'verificado' ? 'Verificado' : 'Verificação Pendente'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Resumo das Fianças */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resumo das Fianças
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <CreditCard className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{inquilino.totalFiancas}</p>
                  <p className="text-sm text-gray-600">Total de Fianças</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-green-600">
                    {new Date(inquilino.dataInicio).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-600">Primeira Fiança</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-purple-600">
                    R$ {inquilino.valorAluguel.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-600">Último Valor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InquilinoDetalhesModal;

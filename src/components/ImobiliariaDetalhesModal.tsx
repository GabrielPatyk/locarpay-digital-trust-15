
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useImobiliariaFiancas } from '@/hooks/useImobiliariaFiancas';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
import { toast } from '@/hooks/use-toast';
import { 
  Building, 
  User, 
  MapPin, 
  FileText, 
  Phone, 
  Mail, 
  Loader2
} from 'lucide-react';
import type { ImobiliariaComPerfil } from '@/hooks/useImobiliariasExecutivo';

interface ImobiliariaDetalhesModalProps {
  isOpen: boolean;
  onClose: () => void;
  imobiliaria: ImobiliariaComPerfil | null;
}

const ImobiliariaDetalhesModal: React.FC<ImobiliariaDetalhesModalProps> = ({
  isOpen,
  onClose,
  imobiliaria
}) => {
  const { formatPhone, formatCNPJ } = usePhoneFormatter();
  const { fiancas: fiancasImobiliaria, isLoading: isLoadingFiancas } = useImobiliariaFiancas(imobiliaria?.id || '');

  const handleLigar = (telefone: string) => {
    if (telefone) {
      window.open(`tel:${telefone}`, '_self');
    } else {
      toast({
        title: "Telefone não disponível",
        description: "Esta imobiliária não possui telefone cadastrado.",
        variant: "destructive",
      });
    }
  };

  const handleEmail = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`, '_blank');
    } else {
      toast({
        title: "E-mail não disponível",
        description: "Esta imobiliária não possui e-mail cadastrado.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (ativo: boolean) => {
    return ativo ? 'bg-success' : 'bg-red-500';
  };

  const getStatusText = (ativo: boolean) => {
    return ativo ? 'Ativa' : 'Inativa';
  };

  const formatPhoneForDisplay = (phone: string) => {
    if (!phone) return 'Não informado';
    return formatPhone(phone);
  };

  const formatCNPJForDisplay = (cnpj: string) => {
    if (!cnpj) return 'Não informado';
    return formatCNPJ(cnpj);
  };

  const getStatusFiancaColor = (status: string) => {
    switch (status) {
      case 'aprovada':
        return 'bg-green-100 text-green-800';
      case 'rejeitada':
        return 'bg-red-100 text-red-800';
      case 'em_analise':
        return 'bg-yellow-100 text-yellow-800';
      case 'ativa':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusFiancaText = (status: string) => {
    switch (status) {
      case 'aprovada':
        return 'Aprovada';
      case 'rejeitada':
        return 'Rejeitada';
      case 'em_analise':
        return 'Em Análise';
      case 'ativa':
        return 'Ativa';
      default:
        return status;
    }
  };

  if (!imobiliaria) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Imobiliária</DialogTitle>
          <DialogDescription>
            Informações completas da imobiliária e suas fianças
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nome da Imobiliária</Label>
                  <p className="text-sm font-medium">{imobiliaria.nome}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">CNPJ</Label>
                  <p className="text-sm font-medium">{formatCNPJForDisplay(imobiliaria.perfil_usuario?.cnpj || '')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge className={`${getStatusColor(imobiliaria.ativo)} text-white text-xs ml-2`}>
                    {getStatusText(imobiliaria.ativo)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nome do Contato</Label>
                  <p className="text-sm font-medium">{imobiliaria.nome}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">E-mail</Label>
                  <p className="text-sm font-medium">{imobiliaria.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                  <p className="text-sm font-medium">{formatPhoneForDisplay(imobiliaria.telefone || '')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              {imobiliaria.perfil_usuario ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Logradouro</Label>
                    <p className="text-sm font-medium">{imobiliaria.perfil_usuario.endereco}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Número</Label>
                    <p className="text-sm font-medium">{imobiliaria.perfil_usuario.numero}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Complemento</Label>
                    <p className="text-sm font-medium">{imobiliaria.perfil_usuario.complemento || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Bairro</Label>
                    <p className="text-sm font-medium">{imobiliaria.perfil_usuario.bairro}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Cidade</Label>
                    <p className="text-sm font-medium">{imobiliaria.perfil_usuario.cidade}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Estado</Label>
                    <p className="text-sm font-medium">{imobiliaria.perfil_usuario.estado}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">País</Label>
                    <p className="text-sm font-medium">{imobiliaria.perfil_usuario.pais}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Endereço não informado</p>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Total de Fianças</Label>
                  <p className="text-2xl font-bold text-primary">{imobiliaria.totalFiancas || 0}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Valor Total</Label>
                  <p className="text-2xl font-bold text-success">R$ {(imobiliaria.valorTotal || 0).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => handleLigar(imobiliaria.telefone || '')}
                  className="w-full"
                  variant="outline"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Ligar
                </Button>
                <Button 
                  onClick={() => handleEmail(imobiliaria.email)}
                  className="w-full"
                  variant="outline"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar E-mail
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Fianças da Imobiliária */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Fianças da Imobiliária
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingFiancas ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : fiancasImobiliaria.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhuma fiança encontrada para esta imobiliária.</p>
              ) : (
                <div className="space-y-3">
                  {fiancasImobiliaria.map((fianca) => (
                    <div key={fianca.id} className="p-3 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-gray-600">ID da Fiança</Label>
                          <p className="text-sm font-medium truncate">{fianca.id}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Inquilino</Label>
                          <p className="text-sm font-medium">{fianca.inquilino_nome_completo}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600">CPF</Label>
                          <p className="text-sm font-medium">{fianca.inquilino_cpf}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Status</Label>
                          <Badge className={`${getStatusFiancaColor(fianca.status_fianca)} text-xs`}>
                            {getStatusFiancaText(fianca.status_fianca)}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Valor da Fiança</Label>
                          <p className="text-sm font-medium text-success">
                            R$ {(fianca.valor_fianca || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Valor do Aluguel</Label>
                          <p className="text-sm font-medium">
                            R$ {(fianca.imovel_valor_aluguel || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Tempo de Locação</Label>
                          <p className="text-sm font-medium">{fianca.imovel_tempo_locacao} meses</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Valor Total (Aluguel × Meses)</Label>
                          <p className="text-sm font-medium text-primary">
                            R$ {((fianca.imovel_valor_aluguel || 0) * (fianca.imovel_tempo_locacao || 1)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Data de Criação</Label>
                          <p className="text-sm font-medium">
                            {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImobiliariaDetalhesModal;

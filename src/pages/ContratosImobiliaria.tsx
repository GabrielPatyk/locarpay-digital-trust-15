import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Plus, 
  Eye, 
  Download, 
  Calendar,
  DollarSign,
  User,
  Building,
  Loader2
} from 'lucide-react';
import { useContratosImobiliaria } from '@/hooks/useContratosImobiliaria';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ContratosImobiliaria = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { contratos, isLoading, error, getStatusLabel, getStatusColor, getTipoLabel } = useContratosImobiliaria();

  const filteredContratos = contratos.filter(contrato =>
    contrato.inquilino_nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${contrato.imovel_endereco} ${contrato.imovel_numero}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVisualizarContrato = (contrato: any) => {
    if (contrato.url_assinatura_inquilino) {
      window.open(contrato.url_assinatura_inquilino, '_blank');
    } else {
      toast({
        title: 'Link não disponível',
        description: 'O link de assinatura ainda está sendo gerado.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadContrato = (contrato: any) => {
    if (contrato.url_assinatura_inquilino) {
      window.open(contrato.url_assinatura_inquilino, '_blank');
    } else {
      toast({
        title: 'Download não disponível',
        description: 'O documento ainda não está disponível para download.',
        variant: 'destructive',
      });
    }
  };

  const calcularDataFim = (dataInicio: string, meses: number) => {
    const data = new Date(dataInicio);
    data.setMonth(data.getMonth() + meses);
    return data.toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <Layout title="Contratos">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Carregando contratos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Contratos">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600">Erro ao carregar contratos. Tente novamente.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Contratos">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Contratos</h1>
            <p className="text-gray-600 text-sm">Visualize todos os contratos vinculados às suas fianças</p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar contratos por inquilino, imóvel ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contratos List */}
        <div className="grid gap-3 sm:gap-4">
          {filteredContratos.map((contrato) => (
            <Card key={contrato.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">{contrato.id.slice(0, 8)}</h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <Badge className={getStatusColor(contrato.status_contrato)}>
                          {getStatusLabel(contrato.status_contrato)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getTipoLabel(contrato.imovel_tipo)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm text-gray-600">Valor Mensal</p>
                    <p className="text-lg sm:text-xl font-bold text-primary">
                      R$ {contrato.imovel_valor_aluguel.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Inquilino</p>
                      <p className="font-medium text-sm">{contrato.inquilino_nome_completo}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Imóvel</p>
                      <p className="font-medium text-sm">
                        {contrato.imovel_endereco}, {contrato.imovel_numero} - {contrato.imovel_bairro}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Período</p>
                      <p className="font-medium text-sm">
                        {new Date(contrato.data_criacao).toLocaleDateString('pt-BR')} - {calcularDataFim(contrato.data_criacao, contrato.imovel_tempo_locacao)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Valor Total</p>
                      <p className="font-medium text-sm">
                        R$ {(contrato.imovel_valor_aluguel * contrato.imovel_tempo_locacao).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => handleVisualizarContrato(contrato)}
                  >
                    <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Visualizar</span>
                    <span className="sm:hidden">Ver</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => handleDownloadContrato(contrato)}
                  >
                    <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">Down</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContratos.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center">
              <FileText className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                Nenhum contrato encontrado
              </h3>
              <p className="text-gray-600 text-sm">
                {searchTerm 
                  ? 'Tente ajustar sua busca.'
                  : 'Nenhum contrato encontrado para esta imobiliária.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ContratosImobiliaria;

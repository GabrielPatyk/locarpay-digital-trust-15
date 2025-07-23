
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Building, 
  DollarSign,
  Eye,
  Search,
  PenTool,
  MapPin
} from 'lucide-react';
import { useContratosInquilino } from '@/hooks/useContratosInquilino';

const Contratos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const { data: contratos = [], isLoading, error } = useContratosInquilino();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'gerando_link': return 'bg-yellow-500';
      case 'aguardando_assinatura': return 'bg-blue-500';
      case 'assinado': return 'bg-green-500';
      case 'cancelado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'gerando_link': return 'Gerando Link';
      case 'aguardando_assinatura': return 'Aguardando Assinatura';
      case 'assinado': return 'Assinado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const filteredContratos = contratos.filter(contrato =>
    contrato.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.fianca?.imovel_tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.fianca?.usuarios?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAddress = (contrato: any) => {
    if (!contrato.fianca) return '';
    const { imovel_endereco, imovel_numero, imovel_complemento, imovel_bairro, imovel_cidade, imovel_estado } = contrato.fianca;
    return `${imovel_endereco}, ${imovel_numero}${imovel_complemento ? ` - ${imovel_complemento}` : ''} - ${imovel_bairro}, ${imovel_cidade}/${imovel_estado}`;
  };

  if (isLoading) {
    return (
      <Layout title="Meus Contratos">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Meus Contratos">
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar contratos: {error.message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Meus Contratos">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header - Otimizado para mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Meus Contratos</h2>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <Input
              placeholder="Buscar contratos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        {/* Stats Cards - Grid responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Contratos Assinados</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    {contratos.filter(c => c.status_contrato === 'assinado').length}
                  </p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Valor Total Fiança</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    R$ {contratos.reduce((acc, c) => acc + (c.valor_fianca || 0), 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Imobiliárias</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">
                    {new Set(contratos.map(c => c.fianca?.usuarios?.nome).filter(Boolean)).size}
                  </p>
                </div>
                <Building className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts List - Otimizado para mobile */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Lista de Contratos</CardTitle>
            <CardDescription className="text-sm">
              Todos os seus contratos de locação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {filteredContratos.map((contrato) => (
                <div
                  key={contrato.id}
                  className="p-3 sm:p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3 space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">Contrato #{contrato.id.slice(0, 8)}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{contrato.fianca?.imovel_tipo}</p>
                      <p className="text-xs sm:text-sm text-gray-500 break-words flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {formatAddress(contrato)}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(contrato.status_contrato)} text-white text-xs mt-1 sm:mt-0`}>
                      {getStatusText(contrato.status_contrato)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3">
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="text-xs text-gray-500">Imobiliária</p>
                      <p className="text-xs sm:text-sm font-medium break-words">{contrato.fianca?.usuarios?.nome || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="text-xs text-gray-500">Valor Fiança</p>
                      <p className="text-xs sm:text-sm font-medium">R$ {contrato.valor_fianca?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="text-xs text-gray-500">Valor Aluguel</p>
                      <p className="text-xs sm:text-sm font-medium">R$ {contrato.valor_aluguel?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="text-xs text-gray-500">Data Criação</p>
                      <p className="text-xs sm:text-sm font-medium">
                        {new Date(contrato.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {contrato.url_assinatura_inquilino && contrato.status_contrato === 'aguardando_assinatura' && (
                      <Button
                        size="sm"
                        onClick={() => window.open(contrato.url_assinatura_inquilino!, '_blank')}
                        className="w-full sm:w-auto"
                      >
                        <PenTool className="mr-2 h-4 w-4" />
                        Assinar Contrato
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/detalhe-contrato/${contrato.id}`)}
                      className="w-full sm:w-auto"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredContratos.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum contrato encontrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
};

export default Contratos;

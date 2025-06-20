
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Eye,
  Download,
  Building,
  Handshake
} from 'lucide-react';

interface Contrato {
  id: string;
  tipo: 'parceria' | 'fianca';
  titulo: string;
  partes: string[];
  valor?: number;
  imovel?: string;
  inquilino?: string;
  status: 'ativo' | 'vencido' | 'assinado' | 'pendente';
  dataAssinatura: string;
  dataVencimento?: string;
  observacoes?: string;
}

const ContratosImobiliaria = () => {
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);

  // Mock data
  const contratos: Contrato[] = [
    {
      id: '1',
      tipo: 'parceria',
      titulo: 'Contrato de Parceria - LocarPay',
      partes: ['Imobiliária Prime Ltda', 'LocarPay Fianças S.A.'],
      status: 'ativo',
      dataAssinatura: '2024-01-05',
      observacoes: 'Contrato de parceria para prestação de serviços de fiança locatícia'
    },
    {
      id: '2',
      tipo: 'fianca',
      titulo: 'Fiança Locatícia - Ana Silva',
      partes: ['Ana Silva', 'Imobiliária Prime Ltda', 'LocarPay Fianças S.A.'],
      valor: 3500,
      imovel: 'Apartamento 2 quartos - Centro',
      inquilino: 'Ana Silva',
      status: 'ativo',
      dataAssinatura: '2024-01-10',
      dataVencimento: '2025-01-10'
    },
    {
      id: '3',
      tipo: 'fianca',
      titulo: 'Fiança Locatícia - Pedro Santos',
      partes: ['Pedro Santos', 'Imobiliária Prime Ltda', 'LocarPay Fianças S.A.'],
      valor: 2800,
      imovel: 'Casa 3 quartos - Jardim América',
      inquilino: 'Pedro Santos',
      status: 'ativo',
      dataAssinatura: '2024-02-15',
      dataVencimento: '2025-02-15'
    },
    {
      id: '4',
      tipo: 'fianca',
      titulo: 'Fiança Locatícia - Carla Oliveira',
      partes: ['Carla Oliveira', 'Imobiliária Prime Ltda', 'LocarPay Fianças S.A.'],
      valor: 2200,
      imovel: 'Apartamento 1 quarto - Vila Nova',
      inquilino: 'Carla Oliveira',
      status: 'vencido',
      dataAssinatura: '2023-12-01',
      dataVencimento: '2024-12-01'
    }
  ];

  const contratosParceria = contratos.filter(c => c.tipo === 'parceria');
  const contratosFianca = contratos.filter(c => c.tipo === 'fianca');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-success';
      case 'assinado': return 'bg-primary';
      case 'vencido': return 'bg-warning';
      case 'pendente': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'assinado': return 'Assinado';
      case 'vencido': return 'Vencido';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  };

  const ContractCard = ({ contrato }: { contrato: Contrato }) => (
    <div className="p-4 rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          {contrato.tipo === 'parceria' ? (
            <Handshake className="h-5 w-5 text-primary" />
          ) : (
            <Building className="h-5 w-5 text-success" />
          )}
          <h4 className="font-medium text-gray-900">{contrato.titulo}</h4>
        </div>
        <Badge className={`${getStatusColor(contrato.status)} text-white`}>
          {getStatusText(contrato.status)}
        </Badge>
      </div>
      
      <div className="space-y-2 mb-3">
        <div>
          <p className="text-sm text-gray-500">Partes Envolvidas</p>
          <p className="text-sm font-medium">{contrato.partes.join(', ')}</p>
        </div>
        
        {contrato.valor && (
          <div>
            <p className="text-sm text-gray-500">Valor</p>
            <p className="text-sm font-medium">R$ {contrato.valor.toLocaleString()}</p>
          </div>
        )}
        
        {contrato.imovel && (
          <div>
            <p className="text-sm text-gray-500">Imóvel</p>
            <p className="text-sm font-medium">{contrato.imovel}</p>
          </div>
        )}
        
        <div>
          <p className="text-sm text-gray-500">Data de Assinatura</p>
          <p className="text-sm font-medium">
            {new Date(contrato.dataAssinatura).toLocaleDateString()}
          </p>
        </div>
        
        {contrato.dataVencimento && (
          <div>
            <p className="text-sm text-gray-500">Data de Vencimento</p>
            <p className="text-sm font-medium">
              {new Date(contrato.dataVencimento).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedContrato(contrato)}
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalhes
        </Button>
        <Button
          variant="outline"
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );

  return (
    <Layout title="Contratos">
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Contratos</p>
                  <p className="text-2xl font-bold text-primary">{contratos.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contratos de Parceria</p>
                  <p className="text-2xl font-bold text-success">{contratosParceria.length}</p>
                </div>
                <Handshake className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contratos de Fiança</p>
                  <p className="text-2xl font-bold text-warning">{contratosFianca.length}</p>
                </div>
                <Building className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contratos Ativos</p>
                  <p className="text-2xl font-bold text-success">
                    {contratos.filter(c => c.status === 'ativo').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Contratos</CardTitle>
            <CardDescription>
              Visualize todos os seus contratos organizados por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="todos" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="parceria">Parceria</TabsTrigger>
                <TabsTrigger value="fiancas">Fianças</TabsTrigger>
              </TabsList>
              
              <TabsContent value="todos" className="space-y-4 mt-4">
                {contratos.map((contrato) => (
                  <ContractCard key={contrato.id} contrato={contrato} />
                ))}
              </TabsContent>
              
              <TabsContent value="parceria" className="space-y-4 mt-4">
                {contratosParceria.map((contrato) => (
                  <ContractCard key={contrato.id} contrato={contrato} />
                ))}
              </TabsContent>
              
              <TabsContent value="fiancas" className="space-y-4 mt-4">
                {contratosFianca.map((contrato) => (
                  <ContractCard key={contrato.id} contrato={contrato} />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Contract Details Modal */}
        {selectedContrato && (
          <Card className="fixed inset-0 z-50 m-4 max-w-2xl mx-auto mt-20 max-h-fit bg-white">
            <CardHeader>
              <CardTitle>Detalhes do Contrato</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setSelectedContrato(null)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Título</p>
                  <p className="font-medium">{selectedContrato.titulo}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <Badge className={selectedContrato.tipo === 'parceria' ? 'bg-primary' : 'bg-success'}>
                    {selectedContrato.tipo === 'parceria' ? 'Contrato de Parceria' : 'Contrato de Fiança'}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Partes Envolvidas</p>
                  <ul className="list-disc list-inside text-sm">
                    {selectedContrato.partes.map((parte, index) => (
                      <li key={index}>{parte}</li>
                    ))}
                  </ul>
                </div>
                
                {selectedContrato.valor && (
                  <div>
                    <p className="text-sm text-gray-500">Valor</p>
                    <p className="font-medium">R$ {selectedContrato.valor.toLocaleString()}</p>
                  </div>
                )}
                
                {selectedContrato.imovel && (
                  <div>
                    <p className="text-sm text-gray-500">Imóvel</p>
                    <p className="font-medium">{selectedContrato.imovel}</p>
                  </div>
                )}
                
                {selectedContrato.inquilino && (
                  <div>
                    <p className="text-sm text-gray-500">Inquilino</p>
                    <p className="font-medium">{selectedContrato.inquilino}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={`${getStatusColor(selectedContrato.status)} text-white`}>
                      {getStatusText(selectedContrato.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data de Assinatura</p>
                    <p className="font-medium">
                      {new Date(selectedContrato.dataAssinatura).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {selectedContrato.dataVencimento && (
                  <div>
                    <p className="text-sm text-gray-500">Data de Vencimento</p>
                    <p className="font-medium">
                      {new Date(selectedContrato.dataVencimento).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                {selectedContrato.observacoes && (
                  <div>
                    <p className="text-sm text-gray-500">Observações</p>
                    <p className="font-medium">{selectedContrato.observacoes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ContratosImobiliaria;

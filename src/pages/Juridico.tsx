
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Scale, 
  FileText, 
  Users, 
  AlertTriangle, 
  Search,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';

interface Contrato {
  id: string;
  inquilino: string;
  imovel: string;
  valor: number;
  dataInicio: string;
  status: 'ativo' | 'vencido' | 'cancelado';
  imobiliaria: string;
}

interface Sinistro {
  id: string;
  contrato: string;
  inquilino: string;
  tipo: 'inadimplencia' | 'danos' | 'abandono';
  valor: number;
  dataOcorrencia: string;
  status: 'aberto' | 'em_analise' | 'resolvido';
  descricao: string;
}

interface Fianca {
  id: string;
  inquilino: string;
  valor: number;
  taxa: number;
  status: 'ativa' | 'encerrada' | 'sinistro';
  dataInicio: string;
  valorPago: number;
}

const Juridico = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('contratos');

  // Mock data
  const contratos: Contrato[] = [
    {
      id: '1',
      inquilino: 'João Silva Santos',
      imovel: 'Apartamento 2 quartos - Jardins',
      valor: 2500,
      dataInicio: '2024-01-15',
      status: 'ativo',
      imobiliaria: 'Imobiliária Prime'
    },
    {
      id: '2',
      inquilino: 'Maria Oliveira',
      imovel: 'Casa 3 quartos - Vila Madalena',
      valor: 4000,
      dataInicio: '2023-12-01',
      status: 'ativo',
      imobiliaria: 'Imobiliária Central'
    },
    {
      id: '3',
      inquilino: 'Carlos Ferreira',
      imovel: 'Apartamento 1 quarto - Pinheiros',
      valor: 3200,
      dataInicio: '2023-11-15',
      status: 'vencido',
      imobiliaria: 'Imobiliária Top'
    }
  ];

  const sinistros: Sinistro[] = [
    {
      id: '1',
      contrato: '1',
      inquilino: 'João Silva Santos',
      tipo: 'inadimplencia',
      valor: 7500,
      dataOcorrencia: '2024-01-10',
      status: 'em_analise',
      descricao: 'Inadimplência de 3 meses consecutivos'
    },
    {
      id: '2',
      contrato: '2',
      inquilino: 'Pedro Almeida',
      tipo: 'danos',
      valor: 3000,
      dataOcorrencia: '2024-01-05',
      status: 'aberto',
      descricao: 'Danos estruturais no imóvel'
    }
  ];

  const fiancas: Fianca[] = [
    {
      id: '1',
      inquilino: 'João Silva Santos',
      valor: 2500,
      taxa: 10,
      status: 'ativa',
      dataInicio: '2024-01-15',
      valorPago: 250
    },
    {
      id: '2',
      inquilino: 'Maria Oliveira',
      valor: 4000,
      taxa: 8,
      status: 'ativa',
      dataInicio: '2023-12-01',
      valorPago: 320
    },
    {
      id: '3',
      inquilino: 'Carlos Ferreira',
      valor: 3200,
      taxa: 12,
      status: 'sinistro',
      dataInicio: '2023-11-15',
      valorPago: 384
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
      case 'ativa':
      case 'resolvido':
        return 'bg-success';
      case 'vencido':
      case 'aberto':
        return 'bg-red-500';
      case 'cancelado':
      case 'encerrada':
        return 'bg-gray-500';
      case 'em_analise':
      case 'sinistro':
        return 'bg-warning';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ativo': 'Ativo',
      'ativa': 'Ativa',
      'vencido': 'Vencido',
      'cancelado': 'Cancelado',
      'encerrada': 'Encerrada',
      'sinistro': 'Sinistro',
      'aberto': 'Aberto',
      'em_analise': 'Em Análise',
      'resolvido': 'Resolvido',
      'inadimplencia': 'Inadimplência',
      'danos': 'Danos',
      'abandono': 'Abandono'
    };
    return statusMap[status] || status;
  };

  const filteredContratos = contratos.filter(c => 
    c.inquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.imovel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.imobiliaria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSinistros = sinistros.filter(s => 
    s.inquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFiancas = fiancas.filter(f => 
    f.inquilino.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalContratos: contratos.length,
    contratosAtivos: contratos.filter(c => c.status === 'ativo').length,
    totalSinistros: sinistros.length,
    sinistrosAbertos: sinistros.filter(s => s.status === 'aberto').length,
    fiancasAtivas: fiancas.filter(f => f.status === 'ativa').length,
    valorTotalFiancas: fiancas.reduce((acc, f) => acc + f.valorPago, 0)
  };

  return (
    <Layout title="Departamento Jurídico">
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contratos Ativos</p>
                  <p className="text-2xl font-bold text-success">{stats.contratosAtivos}</p>
                </div>
                <FileText className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sinistros Abertos</p>
                  <p className="text-2xl font-bold text-red-500">{stats.sinistrosAbertos}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fianças Ativas</p>
                  <p className="text-2xl font-bold text-primary">{stats.fiancasAtivas}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-success">
                    R$ {(stats.valorTotalFiancas / 1000).toFixed(0)}K
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por inquilino, imóvel, imobiliária..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contratos">Contratos</TabsTrigger>
            <TabsTrigger value="sinistros">Sinistros</TabsTrigger>
            <TabsTrigger value="fiancas">Fianças</TabsTrigger>
          </TabsList>

          <TabsContent value="contratos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Contratos
                </CardTitle>
                <CardDescription>
                  Visualização de todos os contratos e seus status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredContratos.map((contrato) => (
                    <div
                      key={contrato.id}
                      className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{contrato.inquilino}</h4>
                          <p className="text-sm text-gray-600">{contrato.imovel}</p>
                        </div>
                        <Badge className={`${getStatusColor(contrato.status)} text-white`}>
                          {getStatusText(contrato.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Valor</p>
                          <p className="text-sm font-medium">R$ {contrato.valor.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Data de Início</p>
                          <p className="text-sm font-medium">
                            {new Date(contrato.dataInicio).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Imobiliária</p>
                          <p className="text-sm font-medium">{contrato.imobiliaria}</p>
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sinistros" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                  Sinistros
                </CardTitle>
                <CardDescription>
                  Acompanhamento de todos os sinistros e ocorrências
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSinistros.map((sinistro) => (
                    <div
                      key={sinistro.id}
                      className="p-4 rounded-lg border border-red-200 bg-red-50/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{sinistro.inquilino}</h4>
                          <p className="text-sm text-gray-600">{sinistro.descricao}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(sinistro.status)} text-white mb-1`}>
                            {getStatusText(sinistro.status)}
                          </Badge>
                          <Badge variant="outline" className="block">
                            {getStatusText(sinistro.tipo)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Valor do Sinistro</p>
                          <p className="text-sm font-medium text-red-600">
                            R$ {sinistro.valor.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Data da Ocorrência</p>
                          <p className="text-sm font-medium">
                            {new Date(sinistro.dataOcorrencia).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Analisar Sinistro
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fiancas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="mr-2 h-5 w-5 text-primary" />
                  Fianças Ativas
                </CardTitle>
                <CardDescription>
                  Controle de todas as fianças locatícias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFiancas.map((fianca) => (
                    <div
                      key={fianca.id}
                      className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{fianca.inquilino}</h4>
                          <p className="text-sm text-gray-600">
                            Taxa: {fianca.taxa}% | Valor: R$ {fianca.valor.toLocaleString()}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(fianca.status)} text-white`}>
                          {getStatusText(fianca.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Valor Pago</p>
                          <p className="text-sm font-medium text-success">
                            R$ {fianca.valorPago.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Data de Início</p>
                          <p className="text-sm font-medium">
                            {new Date(fianca.dataInicio).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Histórico
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Juridico;

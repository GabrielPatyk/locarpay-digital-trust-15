
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Search,
  Eye,
  Download,
  Calendar,
  Building,
  User
} from 'lucide-react';

interface Contrato {
  id: string;
  inquilino: string;
  imovel: string;
  valor: number;
  dataInicio: string;
  dataVencimento: string;
  status: 'ativo' | 'vencido' | 'cancelado' | 'em_revisao';
  imobiliaria: string;
  observacoes?: string;
}

const ContratosJuridico = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data
  const contratos: Contrato[] = [
    {
      id: '1',
      inquilino: 'João Silva Santos',
      imovel: 'Apartamento 2 quartos - Jardins',
      valor: 2500,
      dataInicio: '2024-01-15',
      dataVencimento: '2025-01-15',
      status: 'ativo',
      imobiliaria: 'Imobiliária Prime',
      observacoes: 'Contrato regular sem pendências'
    },
    {
      id: '2',
      inquilino: 'Maria Oliveira',
      imovel: 'Casa 3 quartos - Vila Madalena',
      valor: 4000,
      dataInicio: '2023-12-01',
      dataVencimento: '2024-12-01',
      status: 'em_revisao',
      imobiliaria: 'Imobiliária Central',
      observacoes: 'Necessita revisão de cláusulas'
    },
    {
      id: '3',
      inquilino: 'Carlos Ferreira',
      imovel: 'Apartamento 1 quarto - Pinheiros',
      valor: 3200,
      dataInicio: '2023-11-15',
      dataVencimento: '2024-11-15',
      status: 'vencido',
      imobiliaria: 'Imobiliária Top',
      observacoes: 'Contrato vencido - aguardando renovação'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-success';
      case 'vencido':
        return 'bg-red-500';
      case 'cancelado':
        return 'bg-gray-500';
      case 'em_revisao':
        return 'bg-warning';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ativo': 'Ativo',
      'vencido': 'Vencido',
      'cancelado': 'Cancelado',
      'em_revisao': 'Em Revisão'
    };
    return statusMap[status] || status;
  };

  const filteredContratos = contratos.filter(c => 
    c.inquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.imovel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.imobiliaria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Contratos - Jurídico">
      <div className="space-y-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Contratos Jurídicos
            </CardTitle>
            <CardDescription>
              Gestão e análise jurídica de todos os contratos
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar contratos por inquilino, imóvel ou imobiliária..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contratos List */}
        <div className="space-y-4">
          {filteredContratos.map((contrato) => (
            <Card key={contrato.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {contrato.inquilino}
                    </h3>
                    <p className="text-gray-600 flex items-center">
                      <Building className="mr-1 h-4 w-4" />
                      {contrato.imovel}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(contrato.status)} text-white`}>
                    {getStatusText(contrato.status)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Valor</p>
                    <p className="text-sm font-medium">R$ {contrato.valor.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data de Início</p>
                    <p className="text-sm font-medium flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(contrato.dataInicio).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vencimento</p>
                    <p className="text-sm font-medium flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(contrato.dataVencimento).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Imobiliária</p>
                    <p className="text-sm font-medium">{contrato.imobiliaria}</p>
                  </div>
                </div>

                {contrato.observacoes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Observações</p>
                    <p className="text-sm text-gray-700">{contrato.observacoes}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContratos.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum contrato encontrado
              </h3>
              <p className="text-gray-500">
                Tente ajustar os filtros de busca ou verifique os critérios.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ContratosJuridico;

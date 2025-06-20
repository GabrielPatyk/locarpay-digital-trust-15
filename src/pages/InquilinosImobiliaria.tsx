
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  User, 
  FileText, 
  CheckCircle, 
  Clock, 
  Search,
  Eye,
  Phone,
  Mail
} from 'lucide-react';

interface Inquilino {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  renda: number;
  profissao: string;
  imovel: string;
  valorFianca: number;
  statusFianca: 'ativa' | 'vencida' | 'cancelada';
  dataInicio: string;
  dataVencimento: string;
}

const InquilinosImobiliaria = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquilino, setSelectedInquilino] = useState<Inquilino | null>(null);

  // Mock data
  const inquilinos: Inquilino[] = [
    {
      id: '1',
      nome: 'Ana Silva',
      cpf: '123.456.789-00',
      email: 'ana@email.com',
      telefone: '(11) 99999-9999',
      renda: 7000,
      profissao: 'Engenheira',
      imovel: 'Apartamento 2 quartos - Centro',
      valorFianca: 3500,
      statusFianca: 'ativa',
      dataInicio: '2024-01-10',
      dataVencimento: '2025-01-10'
    },
    {
      id: '2',
      nome: 'Pedro Santos',
      cpf: '987.654.321-00',
      email: 'pedro@email.com',
      telefone: '(11) 88888-8888',
      renda: 5500,
      profissao: 'Designer',
      imovel: 'Casa 3 quartos - Jardim América',
      valorFianca: 2800,
      statusFianca: 'ativa',
      dataInicio: '2024-02-15',
      dataVencimento: '2025-02-15'
    },
    {
      id: '3',
      nome: 'Carla Oliveira',
      cpf: '456.789.123-00',
      email: 'carla@email.com',
      telefone: '(11) 77777-7777',
      renda: 4000,
      profissao: 'Professora',
      imovel: 'Apartamento 1 quarto - Vila Nova',
      valorFianca: 2200,
      statusFianca: 'vencida',
      dataInicio: '2023-12-01',
      dataVencimento: '2024-12-01'
    }
  ];

  const filteredInquilinos = inquilinos.filter(inquilino =>
    inquilino.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquilino.cpf.includes(searchTerm) ||
    inquilino.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-success';
      case 'vencida': return 'bg-warning';
      case 'cancelada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'vencida': return 'Vencida';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const statusCounts = {
    ativa: inquilinos.filter(i => i.statusFianca === 'ativa').length,
    vencida: inquilinos.filter(i => i.statusFianca === 'vencida').length,
    cancelada: inquilinos.filter(i => i.statusFianca === 'cancelada').length,
  };

  return (
    <Layout title="Inquilinos com Fiança">
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fianças Ativas</p>
                  <p className="text-2xl font-bold text-success">{statusCounts.ativa}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fianças Vencidas</p>
                  <p className="text-2xl font-bold text-warning">{statusCounts.vencida}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Inquilinos</p>
                  <p className="text-2xl font-bold text-primary">{inquilinos.length}</p>
                </div>
                <User className="h-8 w-8 text-primary" />
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
                placeholder="Buscar inquilino por nome, CPF ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inquilinos List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Inquilinos</CardTitle>
            <CardDescription>
              Inquilinos com fianças ativas em seus imóveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInquilinos.map((inquilino) => (
                <div
                  key={inquilino.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{inquilino.nome}</h4>
                      <p className="text-sm text-gray-600">CPF: {inquilino.cpf}</p>
                    </div>
                    <Badge className={`${getStatusColor(inquilino.statusFianca)} text-white`}>
                      {getStatusText(inquilino.statusFianca)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Imóvel</p>
                      <p className="text-sm font-medium">{inquilino.imovel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor da Fiança</p>
                      <p className="text-sm font-medium">R$ {inquilino.valorFianca.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vencimento</p>
                      <p className="text-sm font-medium">
                        {new Date(inquilino.dataVencimento).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInquilino(inquilino)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inquilino Details Modal */}
        {selectedInquilino && (
          <Card className="fixed inset-0 z-50 m-4 max-w-2xl mx-auto mt-20 max-h-fit bg-white">
            <CardHeader>
              <CardTitle>Detalhes do Inquilino</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setSelectedInquilino(null)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-medium">{selectedInquilino.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CPF</p>
                    <p className="font-medium">{selectedInquilino.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">E-mail</p>
                    <p className="font-medium flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      {selectedInquilino.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      {selectedInquilino.telefone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profissão</p>
                    <p className="font-medium">{selectedInquilino.profissao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Renda</p>
                    <p className="font-medium">R$ {selectedInquilino.renda.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Imóvel</p>
                  <p className="font-medium">{selectedInquilino.imovel}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Valor da Fiança</p>
                    <p className="font-medium">R$ {selectedInquilino.valorFianca.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={`${getStatusColor(selectedInquilino.statusFianca)} text-white`}>
                      {getStatusText(selectedInquilino.statusFianca)}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Data de Início</p>
                    <p className="font-medium">
                      {new Date(selectedInquilino.dataInicio).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data de Vencimento</p>
                    <p className="font-medium">
                      {new Date(selectedInquilino.dataVencimento).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default InquilinosImobiliaria;

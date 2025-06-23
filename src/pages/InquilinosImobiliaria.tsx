
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Eye, 
  FileText,
  Mail, 
  Phone,
  Calendar,
  CreditCard,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react';
import { useInquilinosImobiliaria } from '@/hooks/useInquilinosImobiliaria';
import InquilinoDetalhesModal from '@/components/InquilinoDetalhesModal';
import FiancasInquilinoModal from '@/components/FiancasInquilinoModal';

const InquilinosImobiliaria = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedInquilino, setSelectedInquilino] = useState(null);
  const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false);
  const [isFiancasModalOpen, setIsFiancasModalOpen] = useState(false);
  
  const {
    inquilinos,
    isLoading,
    error,
    getStatusOptions,
    getStatusColor,
    getStatusLabel,
    getVerificationColor,
    getVerificationLabel,
    stats
  } = useInquilinosImobiliaria(searchTerm, statusFilter);

  const handleVisualizarInquilino = (inquilino: any) => {
    setSelectedInquilino(inquilino);
    setIsDetalhesModalOpen(true);
  };

  const handleVerFiancas = (inquilino: any) => {
    setSelectedInquilino(inquilino);
    setIsFiancasModalOpen(true);
  };

  if (isLoading) {
    return (
      <Layout title="Inquilinos">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Inquilinos">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar inquilinos: {error.message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Inquilinos">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inquilinos</h1>
            <p className="text-gray-600">Gerencie os inquilinos vinculados às suas fianças</p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inquilinos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Inquilinos cadastrados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
              <p className="text-xs text-muted-foreground">
                Inquilinos ativos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inativos</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.inativos}</div>
              <p className="text-xs text-muted-foreground">
                Inquilinos inativos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verificação Pendente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.verificacaoPendente}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando verificação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, email ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inquilinos List */}
        <div className="grid gap-4">
          {inquilinos.map((inquilino) => (
            <Card key={inquilino.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{inquilino.nome}</h3>
                          <p className="text-sm text-gray-600 mb-1">CPF: {inquilino.cpf}</p>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(inquilino.statusAtivo)}>
                              {getStatusLabel(inquilino.statusAtivo)}
                            </Badge>
                            <Badge className={getVerificationColor(inquilino.statusVerificacao)}>
                              {getVerificationLabel(inquilino.statusVerificacao)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Valor do Aluguel</p>
                        <p className="text-xl font-bold text-primary">
                          R$ {inquilino.valorAluguel.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {inquilino.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{inquilino.email}</span>
                        </div>
                      )}
                      {inquilino.telefone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{inquilino.telefone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Primeira fiança: {new Date(inquilino.dataInicio).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {inquilino.totalFiancas} fiança{inquilino.totalFiancas !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVisualizarInquilino(inquilino)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVerFiancas(inquilino)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Fianças
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {inquilinos.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum inquilino encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'todos'
                  ? 'Tente ajustar sua busca ou filtros.'
                  : 'Ainda não há inquilinos com fianças cadastradas.'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        <InquilinoDetalhesModal
          isOpen={isDetalhesModalOpen}
          onClose={() => setIsDetalhesModalOpen(false)}
          inquilino={selectedInquilino}
        />
        
        <FiancasInquilinoModal
          isOpen={isFiancasModalOpen}
          onClose={() => setIsFiancasModalOpen(false)}
          inquilino={selectedInquilino}
        />
      </div>
    </Layout>
  );
};

export default InquilinosImobiliaria;

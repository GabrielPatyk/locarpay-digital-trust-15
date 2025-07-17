
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useImoveisImobiliariaReal } from '@/hooks/useImoveisImobiliariaReal';
import CriarImovelModal from '@/components/CriarImovelModal';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  DollarSign,
  Eye,
  Edit,
  User,
  Loader2,
  Home,
  Ruler,
  Phone,
  Mail,
  ImageIcon
} from 'lucide-react';

const ImoveisImobiliaria = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showCriarModal, setShowCriarModal] = useState(false);
  
  const { 
    imoveis, 
    isLoading, 
    getStatusOptions, 
    getStatusColor, 
    getStatusLabel, 
    stats 
  } = useImoveisImobiliariaReal(searchTerm, statusFilter);

  return (
    <Layout title="Gestão de Imóveis">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Imóveis</h1>
            <p className="text-gray-600">
              Gerencie todos os imóveis da sua imobiliária
            </p>
          </div>
          <Button 
            onClick={() => setShowCriarModal(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Imóvel
          </Button>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
              <Building className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Imóveis cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
              <Home className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.disponiveis}</div>
              <p className="text-xs text-muted-foreground">
                Prontos para locação
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupados</CardTitle>
              <User className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{stats.ocupados}</div>
              <p className="text-xs text-muted-foreground">
                Com inquilinos ativos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Manutenção</CardTitle>
              <Building className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.manutencao}</div>
              <p className="text-xs text-muted-foreground">
                Em manutenção
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome, endereço, bairro, cidade, tipo ou proprietário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
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
          </CardContent>
        </Card>

        {/* Lista de Imóveis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Lista de Imóveis ({imoveis.length})
            </CardTitle>
            <CardDescription>
              Todos os imóveis cadastrados em sua imobiliária
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : imoveis.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum imóvel encontrado</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'todos' 
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Ainda não há imóveis cadastrados para sua imobiliária.'
                  }
                </p>
                <Button onClick={() => setShowCriarModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Imóvel
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {imoveis.map((imovel) => (
                  <Card key={imovel.id} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Seção de Mídias */}
                        <div className="lg:w-1/4">
                          {imovel.midias_urls && imovel.midias_urls.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                              {imovel.midias_urls.slice(0, 4).map((url, index) => (
                                <img
                                  key={index}
                                  src={url}
                                  alt={`Mídia ${index + 1}`}
                                  className="w-full h-20 object-cover rounded border"
                                />
                              ))}
                              {imovel.midias_urls.length > 4 && (
                                <div className="w-full h-20 bg-gray-100 rounded border flex items-center justify-center text-sm text-gray-600">
                                  +{imovel.midias_urls.length - 4} fotos
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-20 bg-gray-100 rounded border flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Informações Principais */}
                        <div className="lg:w-3/4 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2 sm:gap-0">
                            <div>
                              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                {imovel.nome_imovel || `${imovel.endereco}, ${imovel.numero}`}
                              </h4>
                              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {imovel.endereco}, {imovel.numero} - {imovel.bairro}, {imovel.cidade} - {imovel.estado}
                              </p>
                              {imovel.complemento && (
                                <p className="text-sm text-gray-500">{imovel.complemento}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getStatusColor(imovel.status)}>
                                {getStatusLabel(imovel.status)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Tipo</p>
                              <p className="text-sm font-medium">{imovel.tipo}</p>
                            </div>
                            {imovel.area_metros && (
                              <div>
                                <p className="text-sm text-gray-500">Área</p>
                                <p className="text-sm font-medium flex items-center gap-1">
                                  <Ruler className="h-3 w-3" />
                                  {imovel.area_metros}m²
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-500">Valor do Aluguel</p>
                              <p className="text-sm font-medium text-success flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                R$ {imovel.valor_aluguel.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Cadastrado em</p>
                              <p className="text-sm font-medium">
                                {new Date(imovel.data_criacao).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Dados do Proprietário */}
                          {(imovel.proprietario_nome || imovel.proprietario_email || imovel.proprietario_whatsapp) && (
                            <div className="bg-gray-50 p-3 rounded">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">Dados do Proprietário</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {imovel.proprietario_nome && (
                                  <div>
                                    <p className="text-xs text-gray-500">Nome</p>
                                    <p className="text-sm font-medium">{imovel.proprietario_nome}</p>
                                  </div>
                                )}
                                {imovel.proprietario_email && (
                                  <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm font-medium flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {imovel.proprietario_email}
                                    </p>
                                  </div>
                                )}
                                {imovel.proprietario_whatsapp && (
                                  <div>
                                    <p className="text-xs text-gray-500">WhatsApp</p>
                                    <p className="text-sm font-medium flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {imovel.proprietario_whatsapp}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Inquilino se houver */}
                          {imovel.inquilino_nome && (
                            <div>
                              <p className="text-sm text-gray-500">Inquilino</p>
                              <p className="text-sm font-medium">{imovel.inquilino_nome}</p>
                            </div>
                          )}

                          {imovel.descricao && (
                            <div>
                              <p className="text-sm text-gray-500">Descrição</p>
                              <p className="text-sm text-gray-700">{imovel.descricao}</p>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <CriarImovelModal 
          open={showCriarModal} 
          onOpenChange={setShowCriarModal} 
        />
      </div>
    </Layout>
  );
};

export default ImoveisImobiliaria;

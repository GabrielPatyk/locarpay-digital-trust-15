
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Filter, 
  Search, 
  Calendar as CalendarIcon,
  Home,
  Building,
  DollarSign,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const FiancasImobiliaria = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Mock data para as fianças
  const mockFiancas = [
    {
      id: '1',
      inquilino: 'João Silva',
      imovel: 'Apartamento 2 quartos',
      valor: 2500,
      status: 'em_analise',
      dataCriacao: '2024-01-15'
    },
    {
      id: '2',
      inquilino: 'Maria Santos',
      imovel: 'Casa 3 quartos',
      valor: 3200,
      status: 'aprovada',
      dataCriacao: '2024-01-10'
    },
    {
      id: '3',
      inquilino: 'Pedro Oliveira',
      imovel: 'Sala comercial',
      valor: 1800,
      status: 'ativa',
      dataCriacao: '2024-01-05'
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'em_analise': { label: 'Em Análise', variant: 'secondary' as const },
      'aprovada': { label: 'Aprovada', variant: 'default' as const },
      'rejeitada': { label: 'Rejeitada', variant: 'destructive' as const },
      'ativa': { label: 'Ativa', variant: 'default' as const },
      'vencida': { label: 'Vencida', variant: 'destructive' as const },
      'cancelada': { label: 'Cancelada', variant: 'outline' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const [formData, setFormData] = useState({
    // Dados do Inquilino
    inquilino_nome_completo: '',
    inquilino_cpf: '',
    inquilino_email: '',
    inquilino_whatsapp: '',
    inquilino_endereco: '',
    inquilino_numero: '',
    inquilino_complemento: '',
    inquilino_bairro: '',
    inquilino_cidade: '',
    inquilino_estado: '',
    inquilino_pais: 'Brasil',
    inquilino_renda_mensal: '',
    
    // Dados do Imóvel
    imovel_tipo: '',
    imovel_tipo_locacao: '',
    imovel_valor_aluguel: '',
    imovel_descricao: '',
    imovel_area_metros: '',
    imovel_endereco: '',
    imovel_numero: '',
    imovel_complemento: '',
    imovel_bairro: '',
    imovel_cidade: '',
    imovel_estado: '',
    imovel_pais: 'Brasil',
    imovel_tempo_locacao: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados da fiança:', formData);
    // Aqui será implementada a lógica para salvar no banco
    setIsDialogOpen(false);
  };

  // Estatísticas mockadas
  const stats = {
    total: 12,
    pendentes: 3,
    ativas: 8,
    rejeitadas: 1
  };

  return (
    <Layout title="Fianças">
      <div className="space-y-6 animate-fade-in">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Fianças</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fianças Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendentes}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fianças Ativas</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.ativas}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejeitadas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Filtro de Data Início */}
              <div className="space-y-2">
                <Label>Data Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Filtro de Data Fim */}
              <div className="space-y-2">
                <Label>Data Fim</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button className="mt-6">
                <Filter className="mr-2 h-4 w-4" />
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Fianças */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Minhas Fianças</CardTitle>
                <CardDescription>Gerencie todas as suas fianças locatícias</CardDescription>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Gerar Fiança
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Gerar Nova Fiança</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do inquilino e do imóvel para gerar uma nova fiança
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dados do Inquilino */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Dados do Inquilino</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="inquilino_nome_completo">Nome Completo *</Label>
                          <Input
                            id="inquilino_nome_completo"
                            value={formData.inquilino_nome_completo}
                            onChange={(e) => handleInputChange('inquilino_nome_completo', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="inquilino_cpf">CPF *</Label>
                          <Input
                            id="inquilino_cpf"
                            value={formData.inquilino_cpf}
                            onChange={(e) => handleInputChange('inquilino_cpf', e.target.value)}
                            placeholder="000.000.000-00"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="inquilino_email">Email *</Label>
                          <Input
                            id="inquilino_email"
                            type="email"
                            value={formData.inquilino_email}
                            onChange={(e) => handleInputChange('inquilino_email', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="inquilino_whatsapp">WhatsApp *</Label>
                          <Input
                            id="inquilino_whatsapp"
                            value={formData.inquilino_whatsapp}
                            onChange={(e) => handleInputChange('inquilino_whatsapp', e.target.value)}
                            placeholder="+55 (11) 99999-9999"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="inquilino_endereco">Endereço *</Label>
                          <Input
                            id="inquilino_endereco"
                            value={formData.inquilino_endereco}
                            onChange={(e) => handleInputChange('inquilino_endereco', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="inquilino_numero">Número *</Label>
                          <Input
                            id="inquilino_numero"
                            value={formData.inquilino_numero}
                            onChange={(e) => handleInputChange('inquilino_numero', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="inquilino_complemento">Complemento</Label>
                        <Input
                          id="inquilino_complemento"
                          value={formData.inquilino_complemento}
                          onChange={(e) => handleInputChange('inquilino_complemento', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="inquilino_bairro">Bairro *</Label>
                          <Input
                            id="inquilino_bairro"
                            value={formData.inquilino_bairro}
                            onChange={(e) => handleInputChange('inquilino_bairro', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="inquilino_cidade">Cidade *</Label>
                          <Input
                            id="inquilino_cidade"
                            value={formData.inquilino_cidade}
                            onChange={(e) => handleInputChange('inquilino_cidade', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="inquilino_estado">Estado *</Label>
                          <Input
                            id="inquilino_estado"
                            value={formData.inquilino_estado}
                            onChange={(e) => handleInputChange('inquilino_estado', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="inquilino_pais">País</Label>
                          <Input
                            id="inquilino_pais"
                            value={formData.inquilino_pais}
                            readOnly
                            className="bg-gray-100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inquilino_renda_mensal">Renda Mensal *</Label>
                          <Input
                            id="inquilino_renda_mensal"
                            type="number"
                            value={formData.inquilino_renda_mensal}
                            onChange={(e) => handleInputChange('inquilino_renda_mensal', e.target.value)}
                            placeholder="0,00"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dados do Imóvel */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Dados do Imóvel</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="imovel_tipo">Tipo do Imóvel *</Label>
                          <Select value={formData.imovel_tipo} onValueChange={(value) => handleInputChange('imovel_tipo', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="casa">Casa</SelectItem>
                              <SelectItem value="apartamento">Apartamento</SelectItem>
                              <SelectItem value="kitnet">Kitnet</SelectItem>
                              <SelectItem value="studio">Studio</SelectItem>
                              <SelectItem value="sala_comercial">Sala Comercial</SelectItem>
                              <SelectItem value="loja">Loja</SelectItem>
                              <SelectItem value="galpao">Galpão</SelectItem>
                              <SelectItem value="terreno">Terreno</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="imovel_tipo_locacao">Tipo de Locação *</Label>
                          <Select value={formData.imovel_tipo_locacao} onValueChange={(value) => handleInputChange('imovel_tipo_locacao', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residencial">Residencial</SelectItem>
                              <SelectItem value="comercial">Comercial</SelectItem>
                              <SelectItem value="misto">Misto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="imovel_valor_aluguel">Valor do Aluguel *</Label>
                          <Input
                            id="imovel_valor_aluguel"
                            type="number"
                            value={formData.imovel_valor_aluguel}
                            onChange={(e) => handleInputChange('imovel_valor_aluguel', e.target.value)}
                            placeholder="0,00"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="imovel_descricao">Descrição do Imóvel</Label>
                        <Textarea
                          id="imovel_descricao"
                          value={formData.imovel_descricao}
                          onChange={(e) => handleInputChange('imovel_descricao', e.target.value)}
                          placeholder="Ex: 3 quartos, 2 banheiros, área de lazer..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="imovel_area_metros">Área em Metros Quadrados</Label>
                        <Input
                          id="imovel_area_metros"
                          type="number"
                          value={formData.imovel_area_metros}
                          onChange={(e) => handleInputChange('imovel_area_metros', e.target.value)}
                          placeholder="0"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="imovel_endereco">Endereço *</Label>
                          <Input
                            id="imovel_endereco"
                            value={formData.imovel_endereco}
                            onChange={(e) => handleInputChange('imovel_endereco', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="imovel_numero">Número *</Label>
                          <Input
                            id="imovel_numero"
                            value={formData.imovel_numero}
                            onChange={(e) => handleInputChange('imovel_numero', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="imovel_complemento">Complemento</Label>
                        <Input
                          id="imovel_complemento"
                          value={formData.imovel_complemento}
                          onChange={(e) => handleInputChange('imovel_complemento', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="imovel_bairro">Bairro *</Label>
                          <Input
                            id="imovel_bairro"
                            value={formData.imovel_bairro}
                            onChange={(e) => handleInputChange('imovel_bairro', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="imovel_cidade">Cidade *</Label>
                          <Input
                            id="imovel_cidade"
                            value={formData.imovel_cidade}
                            onChange={(e) => handleInputChange('imovel_cidade', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="imovel_estado">Estado *</Label>
                          <Input
                            id="imovel_estado"
                            value={formData.imovel_estado}
                            onChange={(e) => handleInputChange('imovel_estado', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="imovel_pais">País</Label>
                          <Input
                            id="imovel_pais"
                            value={formData.imovel_pais}
                            readOnly
                            className="bg-gray-100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="imovel_tempo_locacao">Tempo de Locação (anos) *</Label>
                          <Input
                            id="imovel_tempo_locacao"
                            type="number"
                            value={formData.imovel_tempo_locacao}
                            onChange={(e) => handleInputChange('imovel_tempo_locacao', e.target.value)}
                            placeholder="1"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        Gerar Fiança
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
          
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar fianças..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="aprovada">Aprovada</SelectItem>
                  <SelectItem value="rejeitada">Rejeitada</SelectItem>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inquilino</TableHead>
                    <TableHead>Imóvel</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFiancas.map((fianca) => (
                    <TableRow key={fianca.id}>
                      <TableCell className="font-medium">{fianca.inquilino}</TableCell>
                      <TableCell>{fianca.imovel}</TableCell>
                      <TableCell>R$ {fianca.valor.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{getStatusBadge(fianca.status)}</TableCell>
                      <TableCell>{new Date(fianca.dataCriacao).toLocaleDateString('pt-BR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FiancasImobiliaria;

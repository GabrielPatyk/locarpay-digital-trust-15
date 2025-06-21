import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit,
  Calendar,
  DollarSign,
  Building,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Proposta {
  id: string;
  imobiliaria: string;
  cliente: string;
  valor: number;
  comissao: number;
  status: 'rascunho' | 'enviada' | 'aceita' | 'rejeitada' | 'negociacao';
  dataEnvio: string;
  dataVencimento: string;
  observacoes: string;
  tipo: 'individual' | 'pacote';
  quantidadeUnidades?: number;
}

const PropostasExecutivo = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    imobiliaria: '',
    cliente: '',
    valor: '',
    comissao: '5',
    tipo: 'individual',
    quantidadeUnidades: '',
    dataVencimento: '',
    observacoes: ''
  });

  // Mock data
  const propostas: Proposta[] = [
    {
      id: '1',
      imobiliaria: 'Imobiliária Prime',
      cliente: 'João Apartments',
      valor: 150000,
      comissao: 5,
      status: 'negociacao',
      dataEnvio: '2024-01-10',
      dataVencimento: '2024-01-25',
      observacoes: 'Cliente interessado em pacote de 50 unidades',
      tipo: 'pacote',
      quantidadeUnidades: 50
    },
    {
      id: '2',
      imobiliaria: 'Imobiliária Central',
      cliente: 'Marina Residencial',
      valor: 85000,
      comissao: 4,
      status: 'aceita',
      dataEnvio: '2024-01-08',
      dataVencimento: '2024-01-20',
      observacoes: 'Proposta aceita com desconto na comissão',
      tipo: 'individual'
    },
    {
      id: '3',
      imobiliaria: 'Imobiliária Elite',
      cliente: 'Torres do Sul',
      valor: 220000,
      comissao: 6,
      status: 'enviada',
      dataEnvio: '2024-01-12',
      dataVencimento: '2024-01-30',
      observacoes: 'Aguardando retorno do cliente',
      tipo: 'pacote',
      quantidadeUnidades: 75
    },
    {
      id: '4',
      imobiliaria: 'Imobiliária Top',
      cliente: 'Residencial Verde',
      valor: 45000,
      comissao: 5,
      status: 'rejeitada',
      dataEnvio: '2024-01-05',
      dataVencimento: '2024-01-18',
      observacoes: 'Cliente optou por outro fornecedor',
      tipo: 'individual'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aceita':
        return 'bg-success';
      case 'rejeitada':
        return 'bg-red-500';
      case 'negociacao':
        return 'bg-warning';
      case 'enviada':
        return 'bg-blue-500';
      case 'rascunho':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'rascunho': 'Rascunho',
      'enviada': 'Enviada',
      'aceita': 'Aceita',
      'rejeitada': 'Rejeitada',
      'negociacao': 'Em Negociação'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aceita':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejeitada':
        return <XCircle className="h-4 w-4" />;
      case 'negociacao':
        return <AlertCircle className="h-4 w-4" />;
      case 'enviada':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nova proposta:', formData);
    setShowNewForm(false);
    setFormData({
      imobiliaria: '',
      cliente: '',
      valor: '',
      comissao: '5',
      tipo: 'individual',
      quantidadeUnidades: '',
      dataVencimento: '',
      observacoes: ''
    });
  };

  const totalPropostas = propostas.length;
  const propostasAceitas = propostas.filter(p => p.status === 'aceita').length;
  const propostasEmAndamento = propostas.filter(p => p.status === 'enviada' || p.status === 'negociacao').length;
  const valorTotalPropostas = propostas.reduce((acc, p) => acc + p.valor, 0);

  return (
    <Layout title="Propostas Comerciais">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Golden Banner */}
        <div className="bg-gradient-to-r from-[#F4D573] via-[#E6C46E] to-[#BC942C] rounded-lg p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-[#0C1C2E]" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0C1C2E]">Propostas Comerciais</h1>
                <p className="text-[#0C1C2E]/80 text-sm">Gerencie todas as suas propostas e negociações</p>
              </div>
            </div>
            <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
              <DialogTrigger asChild>
                <Button className="bg-[#0C1C2E] hover:bg-[#1A2F45] text-white text-sm w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Proposta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Criar Nova Proposta</DialogTitle>
                  <DialogDescription className="text-sm">
                    Preencha os dados da nova proposta comercial
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="imobiliaria" className="text-sm">Imobiliária*</Label>
                      <Select value={formData.imobiliaria} onValueChange={(value) => handleInputChange('imobiliaria', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a imobiliária" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Imobiliária Prime">Imobiliária Prime</SelectItem>
                          <SelectItem value="Imobiliária Central">Imobiliária Central</SelectItem>
                          <SelectItem value="Imobiliária Elite">Imobiliária Elite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cliente" className="text-sm">Cliente*</Label>
                      <Input
                        id="cliente"
                        value={formData.cliente}
                        onChange={(e) => handleInputChange('cliente', e.target.value)}
                        placeholder="Nome do cliente"
                        className="text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="tipo">Tipo de Proposta*</Label>
                      <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="pacote">Pacote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.tipo === 'pacote' && (
                      <div>
                        <Label htmlFor="quantidadeUnidades">Quantidade de Unidades</Label>
                        <Input
                          id="quantidadeUnidades"
                          type="number"
                          value={formData.quantidadeUnidades}
                          onChange={(e) => handleInputChange('quantidadeUnidades', e.target.value)}
                          placeholder="Ex: 50"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="valor">Valor Total da Proposta (R$)*</Label>
                      <Input
                        id="valor"
                        type="number"
                        value={formData.valor}
                        onChange={(e) => handleInputChange('valor', e.target.value)}
                        placeholder="Ex: 150000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="comissao">Comissão (%)*</Label>
                      <Input
                        id="comissao"
                        type="number"
                        value={formData.comissao}
                        onChange={(e) => handleInputChange('comissao', e.target.value)}
                        placeholder="Ex: 5"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                    <Input
                      id="dataVencimento"
                      type="date"
                      value={formData.dataVencimento}
                      onChange={(e) => handleInputChange('dataVencimento', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      placeholder="Informações adicionais sobre a proposta..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewForm(false)}
                      className="flex-1 text-sm"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E] text-sm"
                    >
                      Criar Proposta
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{totalPropostas}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Aceitas</p>
                  <p className="text-lg sm:text-2xl font-bold text-success">{propostasAceitas}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Em Andamento</p>
                  <p className="text-lg sm:text-2xl font-bold text-warning">{propostasEmAndamento}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-success">
                    R$ {(valorTotalPropostas / 1000).toFixed(0)}K
                  </p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Propostas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Todas as Propostas</CardTitle>
            <CardDescription className="text-sm">
              Histórico completo de propostas comerciais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {propostas.map((proposta) => (
                <div
                  key={proposta.id}
                  className="p-3 sm:p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2 sm:gap-0">
                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center text-sm sm:text-base">
                        {getStatusIcon(proposta.status)}
                        <span className="ml-2">{proposta.cliente}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">{proposta.imobiliaria}</p>
                    </div>
                    <Badge className={`${getStatusColor(proposta.status)} text-white text-xs`}>
                      {getStatusText(proposta.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-3">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Valor</p>
                      <p className="text-xs sm:text-sm font-medium">
                        R$ {proposta.valor.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Comissão</p>
                      <p className="text-xs sm:text-sm font-medium">{proposta.comissao}%</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Tipo</p>
                      <p className="text-xs sm:text-sm font-medium">
                        {proposta.tipo === 'pacote' ? `Pacote (${proposta.quantidadeUnidades} un.)` : 'Individual'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Data Envio</p>
                      <p className="text-xs sm:text-sm font-medium">
                        {new Date(proposta.dataEnvio).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Vencimento</p>
                      <p className="text-xs sm:text-sm font-medium">
                        {new Date(proposta.dataVencimento).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs sm:text-sm text-gray-500">Observações</p>
                    <p className="text-xs sm:text-sm text-gray-900">{proposta.observacoes}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Ver Detalhes</span>
                      <span className="sm:hidden">Detalhes</span>
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Editar</span>
                      <span className="sm:hidden">Editar</span>
                    </Button>
                    {proposta.status === 'rascunho' && (
                      <Button size="sm" className="bg-primary text-xs">
                        <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Enviar</span>
                        <span className="sm:hidden">Enviar</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PropostasExecutivo;

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  User, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  PenTool,
  Eye,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react';

interface Proposta {
  id: string;
  inquilinoNome: string;
  inquilinoCpf: string;
  inquilinoEmail: string;
  inquilinoWhatsapp: string;
  inquilinoDataNascimento: string;
  inquilinoEstadoCivil: string;
  inquilinoEndereco: string;
  renda: number;
  profissao: string;
  tempoEmprego: string;
  imovelDescricao: string;
  imovelTipo: string;
  imovelQuartos: number;
  imovelBanheiros: number;
  imovelArea: number;
  imovelRegiao: string;
  imovelEndereco: string;
  valor: number;
  status: 'enviado' | 'analise' | 'aprovado' | 'reprovado' | 'assinado';
  dataEnvio: string;
  observacoes?: string;
}

const Imobiliaria = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedProposta, setSelectedProposta] = useState<Proposta | null>(null);
  
  // Form states with complete data
  const [formData, setFormData] = useState({
    inquilinoNome: '',
    inquilinoCpf: '',
    inquilinoEmail: '',
    inquilinoWhatsapp: '',
    inquilinoDataNascimento: '',
    inquilinoEstadoCivil: '',
    inquilinoEndereco: '',
    renda: '',
    profissao: '',
    tempoEmprego: '',
    imovelDescricao: '',
    imovelTipo: '',
    imovelQuartos: '',
    imovelBanheiros: '',
    imovelArea: '',
    imovelRegiao: '',
    imovelEndereco: '',
    valor: '',
    observacoes: ''
  });

  // Mock data with enhanced structure
  const [propostas, setPropostas] = useState<Proposta[]>([
    {
      id: '1',
      inquilinoNome: 'Ana Silva',
      inquilinoCpf: '123.456.789-00',
      inquilinoEmail: 'ana@email.com',
      inquilinoWhatsapp: '11999887766',
      inquilinoDataNascimento: '1990-05-15',
      inquilinoEstadoCivil: 'Solteira',
      inquilinoEndereco: 'Rua das Flores, 123 - Vila Nova',
      renda: 7000,
      profissao: 'Engenheira',
      tempoEmprego: '3 anos',
      imovelDescricao: 'Apartamento moderno com vista para o parque',
      imovelTipo: 'Apartamento',
      imovelQuartos: 2,
      imovelBanheiros: 2,
      imovelArea: 65,
      imovelRegiao: 'Centro',
      imovelEndereco: 'Av. Central, 456 - Centro',
      valor: 3500,
      status: 'aprovado',
      dataEnvio: '2024-01-10'
    },
    {
      id: '2',
      inquilinoNome: 'Pedro Santos',
      inquilinoCpf: '987.654.321-00',
      inquilinoEmail: 'pedro@email.com',
      inquilinoWhatsapp: '11888776655',
      inquilinoDataNascimento: '1985-12-20',
      inquilinoEstadoCivil: 'Casado',
      inquilinoEndereco: 'Rua do Sol, 789 - Jardim América',
      renda: 5500,
      profissao: 'Designer',
      tempoEmprego: '2 anos',
      imovelDescricao: 'Casa com quintal e garagem',
      imovelTipo: 'Casa',
      imovelQuartos: 3,
      imovelBanheiros: 2,
      imovelArea: 120,
      imovelRegiao: 'Jardim América',
      imovelEndereco: 'Rua das Palmeiras, 321 - Jardim América',
      valor: 2800,
      status: 'analise',
      dataEnvio: '2024-01-12'
    }
  ]);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Bom dia';
    if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
    else if (hour >= 18) greeting = 'Boa noite';
    
    return `${greeting}, ${user?.companyName || user?.name}!`;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaProposta: Proposta = {
      id: Date.now().toString(),
      inquilinoNome: formData.inquilinoNome,
      inquilinoCpf: formData.inquilinoCpf,
      inquilinoEmail: formData.inquilinoEmail,
      inquilinoWhatsapp: formData.inquilinoWhatsapp,
      inquilinoDataNascimento: formData.inquilinoDataNascimento,
      inquilinoEstadoCivil: formData.inquilinoEstadoCivil,
      inquilinoEndereco: formData.inquilinoEndereco,
      renda: Number(formData.renda),
      profissao: formData.profissao,
      tempoEmprego: formData.tempoEmprego,
      imovelDescricao: formData.imovelDescricao,
      imovelTipo: formData.imovelTipo,
      imovelQuartos: Number(formData.imovelQuartos),
      imovelBanheiros: Number(formData.imovelBanheiros),
      imovelArea: Number(formData.imovelArea),
      imovelRegiao: formData.imovelRegiao,
      imovelEndereco: formData.imovelEndereco,
      valor: Number(formData.valor),
      status: 'enviado',
      dataEnvio: new Date().toISOString().split('T')[0],
      observacoes: formData.observacoes
    };

    setPropostas(prev => [novaProposta, ...prev]);
    
    // Reset form
    setFormData({
      inquilinoNome: '',
      inquilinoCpf: '',
      inquilinoEmail: '',
      inquilinoWhatsapp: '',
      inquilinoDataNascimento: '',
      inquilinoEstadoCivil: '',
      inquilinoEndereco: '',
      renda: '',
      profissao: '',
      tempoEmprego: '',
      imovelDescricao: '',
      imovelTipo: '',
      imovelQuartos: '',
      imovelBanheiros: '',
      imovelArea: '',
      imovelRegiao: '',
      imovelEndereco: '',
      valor: '',
      observacoes: ''
    });
    
    setShowNewForm(false);

    toast({
      title: "Proposta enviada com sucesso!",
      description: "A proposta foi enviada para análise e você receberá uma resposta em breve.",
    });
  };

  const assinarContrato = (proposta: Proposta) => {
    const updatedPropostas = propostas.map(p => 
      p.id === proposta.id ? { ...p, status: 'assinado' as const } : p
    );
    setPropostas(updatedPropostas);
    
    toast({
      title: "Contrato assinado digitalmente!",
      description: "O inquilino receberá uma cópia por e-mail.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-success';
      case 'reprovado': return 'bg-red-500';
      case 'assinado': return 'bg-primary';
      case 'analise': return 'bg-warning';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'enviado': return 'Enviado';
      case 'analise': return 'Em Análise';
      case 'aprovado': return 'Aprovado';
      case 'reprovado': return 'Reprovado';
      case 'assinado': return 'Assinado';
      default: return status;
    }
  };

  const statusCounts = {
    enviado: propostas.filter(p => p.status === 'enviado').length,
    analise: propostas.filter(p => p.status === 'analise').length,
    aprovado: propostas.filter(p => p.status === 'aprovado').length,
    assinado: propostas.filter(p => p.status === 'assinado').length,
  };

  return (
    <Layout title="Dashboard Imobiliária">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Welcome Section with LocarPay branding */}
        <div className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] rounded-lg p-4 sm:p-6 text-[#0C1C2E] relative overflow-hidden">
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-20">
            <img 
              src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
              alt="LocarPay Logo" 
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold mb-2">{getWelcomeMessage()}</h1>
          <p className="opacity-90 mb-4 text-sm sm:text-base">
            Bem-vindo à plataforma LocarPay. Gerencie suas propostas de fiança e acompanhe o status de todas as solicitações em um só lugar.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button 
              onClick={() => setShowNewForm(true)}
              className="bg-white text-[#0C1C2E] hover:bg-gray-100 font-semibold shadow-md text-sm sm:text-base"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Proposta
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Enviadas</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-700">{statusCounts.enviado}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Em Análise</p>
                  <p className="text-lg sm:text-2xl font-bold text-warning">{statusCounts.analise}</p>
                </div>
                <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Aprovadas</p>
                  <p className="text-lg sm:text-2xl font-bold text-success">{statusCounts.aprovado}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Assinadas</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{statusCounts.assinado}</p>
                </div>
                <PenTool className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Minhas Propostas</h2>
          <Button onClick={() => setShowNewForm(true)} className="bg-success hover:bg-success/90 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nova Proposta
          </Button>
        </div>

        {showNewForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Nova Proposta de Fiança</CardTitle>
              <CardDescription className="text-sm">
                Preencha todos os dados do locatário e do imóvel para enviar uma nova proposta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Dados do Inquilino */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary">Dados do Inquilino</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="inquilinoNome" className="text-sm">Nome Completo *</Label>
                      <Input
                        id="inquilinoNome"
                        value={formData.inquilinoNome}
                        onChange={(e) => handleInputChange('inquilinoNome', e.target.value)}
                        placeholder="Nome completo do inquilino"
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="inquilinoCpf" className="text-sm">CPF *</Label>
                      <Input
                        id="inquilinoCpf"
                        value={formData.inquilinoCpf}
                        onChange={(e) => handleInputChange('inquilinoCpf', e.target.value)}
                        placeholder="000.000.000-00"
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="inquilinoEmail" className="text-sm">E-mail *</Label>
                      <Input
                        id="inquilinoEmail"
                        type="email"
                        value={formData.inquilinoEmail}
                        onChange={(e) => handleInputChange('inquilinoEmail', e.target.value)}
                        placeholder="email@exemplo.com"
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="inquilinoWhatsapp" className="text-sm">WhatsApp *</Label>
                      <Input
                        id="inquilinoWhatsapp"
                        value={formData.inquilinoWhatsapp}
                        onChange={(e) => handleInputChange('inquilinoWhatsapp', e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="inquilinoDataNascimento" className="text-sm">Data de Nascimento *</Label>
                      <Input
                        id="inquilinoDataNascimento"
                        type="date"
                        value={formData.inquilinoDataNascimento}
                        onChange={(e) => handleInputChange('inquilinoDataNascimento', e.target.value)}
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="inquilinoEstadoCivil" className="text-sm">Estado Civil *</Label>
                      <Select value={formData.inquilinoEstadoCivil} onValueChange={(value) => handleInputChange('inquilinoEstadoCivil', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado civil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                          <SelectItem value="casado">Casado(a)</SelectItem>
                          <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                          <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                          <SelectItem value="uniao-estavel">União Estável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="profissao" className="text-sm">Profissão *</Label>
                      <Input
                        id="profissao"
                        value={formData.profissao}
                        onChange={(e) => handleInputChange('profissao', e.target.value)}
                        placeholder="Profissão do inquilino"
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tempoEmprego" className="text-sm">Tempo no Emprego *</Label>
                      <Input
                        id="tempoEmprego"
                        value={formData.tempoEmprego}
                        onChange={(e) => handleInputChange('tempoEmprego', e.target.value)}
                        placeholder="Ex: 2 anos"
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="renda" className="text-sm">Renda Mensal (R$) *</Label>
                      <Input
                        id="renda"
                        type="number"
                        value={formData.renda}
                        onChange={(e) => handleInputChange('renda', e.target.value)}
                        placeholder="5000"
                        className="text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="inquilinoEndereco" className="text-sm">Endereço Completo *</Label>
                    <Input
                      id="inquilinoEndereco"
                      value={formData.inquilinoEndereco}
                      onChange={(e) => handleInputChange('inquilinoEndereco', e.target.value)}
                      placeholder="Rua, número, bairro, cidade - CEP"
                      className="text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Dados do Imóvel */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary">Dados do Imóvel</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="imovelTipo" className="text-sm">Tipo do Imóvel *</Label>
                      <Select value={formData.imovelTipo} onValueChange={(value) => handleInputChange('imovelTipo', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartamento">Apartamento</SelectItem>
                          <SelectItem value="casa">Casa</SelectItem>
                          <SelectItem value="kitnet">Kitnet</SelectItem>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="loft">Loft</SelectItem>
                          <SelectItem value="sobrado">Sobrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="imovelRegiao" className="text-sm">Região *</Label>
                      <Input
                        id="imovelRegiao"
                        value={formData.imovelRegiao}
                        onChange={(e) => handleInputChange('imovelRegiao', e.target.value)}
                        placeholder="Ex: Centro, Vila Madalena"
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="imovelQuartos" className="text-sm">Quartos *</Label>
                      <Input
                        id="imovelQuartos"
                        type="number"
                        value={formData.imovelQuartos}
                        onChange={(e) => handleInputChange('imovelQuartos', e.target.value)}
                        placeholder="2"
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="imovelBanheiros" className="text-sm">Banheiros *</Label>
                      <Input
                        id="imovelBanheiros"
                        type="number"
                        value={formData.imovelBanheiros}
                        onChange={(e) => handleInputChange('imovelBanheiros', e.target.value)}
                        placeholder="1"
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="imovelArea" className="text-sm">Área (m²) *</Label>
                      <Input
                        id="imovelArea"
                        type="number"
                        value={formData.imovelArea}
                        onChange={(e) => handleInputChange('imovelArea', e.target.value)}
                        placeholder="65"
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="valor" className="text-sm">Valor do Aluguel (R$) *</Label>
                      <Input
                        id="valor"
                        type="number"
                        value={formData.valor}
                        onChange={(e) => handleInputChange('valor', e.target.value)}
                        placeholder="2500"
                        className="text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="imovelEndereco" className="text-sm">Endereço Completo do Imóvel *</Label>
                      <Input
                        id="imovelEndereco"
                        value={formData.imovelEndereco}
                        onChange={(e) => handleInputChange('imovelEndereco', e.target.value)}
                        placeholder="Rua, número, bairro, cidade - CEP"
                        className="text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="imovelDescricao" className="text-sm">Descrição do Imóvel *</Label>
                      <Textarea
                        id="imovelDescricao"
                        value={formData.imovelDescricao}
                        onChange={(e) => handleInputChange('imovelDescricao', e.target.value)}
                        placeholder="Descreva as características do imóvel, como mobília, diferenciais, etc."
                        rows={3}
                        className="text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="observacoes" className="text-sm">Observações Gerais</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Informações adicionais sobre o inquilino ou situação"
                    rows={3}
                    className="text-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button type="submit" className="bg-success hover:bg-success/90 text-sm w-full sm:w-auto">
                    Enviar Proposta Completa
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewForm(false)} className="text-sm w-full sm:w-auto">
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Proposals List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Histórico de Propostas</CardTitle>
            <CardDescription className="text-sm">
              Acompanhe o status de todas as suas propostas
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
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{proposta.inquilinoNome}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">CPF: {proposta.inquilinoCpf}</p>
                      <p className="text-xs sm:text-sm text-gray-600">WhatsApp: {proposta.inquilinoWhatsapp}</p>
                    </div>
                    <Badge className={`${getStatusColor(proposta.status)} text-white text-xs`}>
                      {getStatusText(proposta.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Imóvel</p>
                      <p className="text-xs sm:text-sm font-medium">{proposta.imovelTipo} - {proposta.imovelRegiao}</p>
                      <p className="text-xs text-gray-400">{proposta.imovelQuartos}Q • {proposta.imovelBanheiros}B • {proposta.imovelArea}m²</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Valor</p>
                      <p className="text-xs sm:text-sm font-medium">R$ {proposta.valor.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Data de Envio</p>
                      <p className="text-xs sm:text-sm font-medium">
                        {new Date(proposta.dataEnvio).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProposta(proposta)}
                      className="text-xs w-full sm:w-auto"
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      Ver Detalhes
                    </Button>
                    
                    {proposta.status === 'aprovado' && (
                      <Button
                        size="sm"
                        onClick={() => assinarContrato(proposta)}
                        className="bg-primary hover:bg-primary/90 text-xs w-full sm:w-auto"
                      >
                        <PenTool className="mr-2 h-3 w-3" />
                        Assinar Contrato
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proposal Details Modal */}
        {selectedProposta && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="relative">
                <CardTitle className="text-lg sm:text-xl pr-8">Detalhes da Proposta</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 sm:top-4 sm:right-4"
                  onClick={() => setSelectedProposta(null)}
                >
                  ×
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Dados do Inquilino */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary">Dados do Inquilino</h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label>Nome</Label>
                        <p className="font-medium">{selectedProposta.inquilinoNome}</p>
                      </div>
                      <div>
                        <Label>CPF</Label>
                        <p className="font-medium">{selectedProposta.inquilinoCpf}</p>
                      </div>
                      <div>
                        <Label>E-mail</Label>
                        <p className="font-medium">{selectedProposta.inquilinoEmail}</p>
                      </div>
                      <div>
                        <Label>WhatsApp</Label>
                        <p className="font-medium">{selectedProposta.inquilinoWhatsapp}</p>
                      </div>
                      <div>
                        <Label>Data de Nascimento</Label>
                        <p className="font-medium">{selectedProposta.inquilinoDataNascimento}</p>
                      </div>
                      <div>
                        <Label>Estado Civil</Label>
                        <p className="font-medium">{selectedProposta.inquilinoEstadoCivil}</p>
                      </div>
                      <div>
                        <Label>Profissão</Label>
                        <p className="font-medium">{selectedProposta.profissao}</p>
                      </div>
                      <div>
                        <Label>Renda</Label>
                        <p className="font-medium">R$ {selectedProposta.renda.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Endereço</Label>
                      <p className="font-medium">{selectedProposta.inquilinoEndereco}</p>
                    </div>
                  </div>

                  {/* Dados do Imóvel */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary">Dados do Imóvel</h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label>Tipo</Label>
                        <p className="font-medium">{selectedProposta.imovelTipo}</p>
                      </div>
                      <div>
                        <Label>Região</Label>
                        <p className="font-medium">{selectedProposta.imovelRegiao}</p>
                      </div>
                      <div>
                        <Label>Quartos</Label>
                        <p className="font-medium">{selectedProposta.imovelQuartos}</p>
                      </div>
                      <div>
                        <Label>Banheiros</Label>
                        <p className="font-medium">{selectedProposta.imovelBanheiros}</p>
                      </div>
                      <div>
                        <Label>Área</Label>
                        <p className="font-medium">{selectedProposta.imovelArea}m²</p>
                      </div>
                      <div>
                        <Label>Valor do Aluguel</Label>
                        <p className="font-medium">R$ {selectedProposta.valor.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label>Endereço do Imóvel</Label>
                        <p className="font-medium">{selectedProposta.imovelEndereco}</p>
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <p className="font-medium">{selectedProposta.imovelDescricao}</p>
                      </div>
                    </div>
                  </div>

                  {selectedProposta.observacoes && (
                    <div>
                      <Label>Observações</Label>
                      <p className="font-medium">{selectedProposta.observacoes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Imobiliaria;

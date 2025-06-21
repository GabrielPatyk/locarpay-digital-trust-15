
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building, 
  Plus, 
  Phone, 
  Mail, 
  MapPin,
  User,
  FileText,
  Eye
} from 'lucide-react';

interface Imobiliaria {
  id: string;
  nome: string;
  cnpj: string;
  contato: string;
  email: string;
  telefone: string;
  endereco: string;
  status: 'ativa' | 'inativa' | 'pendente';
  totalFiancas: number;
  valorTotal: number;
  dataVinculo: string;
}

const ImobiliariasExecutivo = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    contato: '',
    email: '',
    telefone: '',
    endereco: '',
    observacoes: ''
  });

  // Mock data
  const imobiliarias: Imobiliaria[] = [
    {
      id: '1',
      nome: 'Imobiliária Prime',
      cnpj: '12.345.678/0001-90',
      contato: 'Roberto Silva',
      email: 'roberto@prime.com',
      telefone: '(11) 99999-9999',
      endereco: 'Av. Paulista, 1000 - São Paulo',
      status: 'ativa',
      totalFiancas: 15,
      valorTotal: 37500,
      dataVinculo: '2023-06-15'
    },
    {
      id: '2',
      nome: 'Imobiliária Central',
      cnpj: '23.456.789/0001-01',
      contato: 'Sandra Costa',
      email: 'sandra@central.com',
      telefone: '(11) 88888-8888',
      endereco: 'Rua Augusta, 500 - São Paulo',
      status: 'ativa',
      totalFiancas: 22,
      valorTotal: 68000,
      dataVinculo: '2023-08-20'
    },
    {
      id: '3',
      nome: 'Imobiliária Novo Horizonte',
      cnpj: '34.567.890/0001-12',
      contato: 'Carlos Mendes',
      email: 'carlos@horizonte.com',
      telefone: '(11) 77777-7777',
      endereco: 'Av. Faria Lima, 200 - São Paulo',
      status: 'pendente',
      totalFiancas: 0,
      valorTotal: 0,
      dataVinculo: '2024-01-10'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'bg-success';
      case 'inativa':
        return 'bg-red-500';
      case 'pendente':
        return 'bg-warning';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'ativa': 'Ativa',
      'inativa': 'Inativa',
      'pendente': 'Pendente'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nova imobiliária:', formData);
    // Aqui você implementaria a lógica para salvar
    setShowNewForm(false);
    setFormData({
      nome: '',
      cnpj: '',
      contato: '',
      email: '',
      telefone: '',
      endereco: '',
      observacoes: ''
    });
  };

  return (
    <Layout title="Minhas Imobiliárias">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Minhas Imobiliárias</h1>
            <p className="text-gray-600 text-sm">Gerencie suas imobiliárias parceiras</p>
          </div>
          <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E] text-sm w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Nova Imobiliária
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Cadastrar Nova Imobiliária</DialogTitle>
                <DialogDescription className="text-sm">
                  Preencha as informações da nova imobiliária parceira
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="nome" className="text-sm">Nome da Imobiliária*</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnpj" className="text-sm">CNPJ*</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange('cnpj', e.target.value)}
                      placeholder="00.000.000/0000-00"
                      className="text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="contato" className="text-sm">Nome do Contato*</Label>
                    <Input
                      id="contato"
                      value={formData.contato}
                      onChange={(e) => handleInputChange('contato', e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone" className="text-sm">Telefone*</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm">E-mail*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="text-sm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endereco" className="text-sm">Endereço Completo*</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    className="text-sm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="observacoes" className="text-sm">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Informações adicionais sobre a parceria..."
                    className="text-sm"
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
                    Cadastrar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{imobiliarias.length}</p>
                </div>
                <Building className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Ativas</p>
                  <p className="text-lg sm:text-2xl font-bold text-success">
                    {imobiliarias.filter(i => i.status === 'ativa').length}
                  </p>
                </div>
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Fianças</p>
                  <p className="text-lg sm:text-2xl font-bold text-warning">
                    {imobiliarias.reduce((acc, i) => acc + i.totalFiancas, 0)}
                  </p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Imobiliárias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Building className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Imobiliárias Parceiras
            </CardTitle>
            <CardDescription className="text-sm">
              Lista de imobiliárias vinculadas ao seu portfólio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {imobiliarias.map((imobiliaria) => (
                <div
                  key={imobiliaria.id}
                  className="p-3 sm:p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2 sm:gap-0">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{imobiliaria.nome}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">CNPJ: {imobiliaria.cnpj}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Contato: {imobiliaria.contato}</p>
                    </div>
                    <Badge className={`${getStatusColor(imobiliaria.status)} text-white text-xs`}>
                      {getStatusText(imobiliaria.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">E-mail</p>
                      <p className="text-xs sm:text-sm font-medium truncate">{imobiliaria.email}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Telefone</p>
                      <p className="text-xs sm:text-sm font-medium">{imobiliaria.telefone}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Total Fianças</p>
                      <p className="text-xs sm:text-sm font-medium">{imobiliaria.totalFiancas}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Valor Total</p>
                      <p className="text-xs sm:text-sm font-medium text-success">
                        R$ {imobiliaria.valorTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <p className="text-xs sm:text-sm text-gray-500">Endereço</p>
                    <p className="text-xs sm:text-sm text-gray-900">{imobiliaria.endereco}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Ver Detalhes</span>
                      <span className="sm:hidden">Detalhes</span>
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Phone className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Ligar</span>
                      <span className="sm:hidden">Ligar</span>
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Mail className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">E-mail</span>
                      <span className="sm:hidden">Email</span>
                    </Button>
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

export default ImobiliariasExecutivo;

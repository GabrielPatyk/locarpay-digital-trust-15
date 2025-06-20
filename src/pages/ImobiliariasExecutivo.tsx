
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
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minhas Imobiliárias</h1>
            <p className="text-gray-600">Gerencie suas imobiliárias parceiras</p>
          </div>
          <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E]">
                <Plus className="mr-2 h-4 w-4" />
                Nova Imobiliária
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Imobiliária</DialogTitle>
                <DialogDescription>
                  Preencha as informações da nova imobiliária parceira
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome da Imobiliária*</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnpj">CNPJ*</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange('cnpj', e.target.value)}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contato">Nome do Contato*</Label>
                    <Input
                      id="contato"
                      value={formData.contato}
                      onChange={(e) => handleInputChange('contato', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone*</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-mail*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endereco">Endereço Completo*</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Informações adicionais sobre a parceria..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E]"
                  >
                    Cadastrar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-primary">{imobiliarias.length}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ativas</p>
                  <p className="text-2xl font-bold text-success">
                    {imobiliarias.filter(i => i.status === 'ativa').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fianças</p>
                  <p className="text-2xl font-bold text-warning">
                    {imobiliarias.reduce((acc, i) => acc + i.totalFiancas, 0)}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Imobiliárias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Imobiliárias Parceiras
            </CardTitle>
            <CardDescription>
              Lista de imobiliárias vinculadas ao seu portfólio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imobiliarias.map((imobiliaria) => (
                <div
                  key={imobiliaria.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{imobiliaria.nome}</h4>
                      <p className="text-sm text-gray-600">CNPJ: {imobiliaria.cnpj}</p>
                      <p className="text-sm text-gray-600">Contato: {imobiliaria.contato}</p>
                    </div>
                    <Badge className={`${getStatusColor(imobiliaria.status)} text-white`}>
                      {getStatusText(imobiliaria.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">E-mail</p>
                      <p className="text-sm font-medium">{imobiliaria.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="text-sm font-medium">{imobiliaria.telefone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Fianças</p>
                      <p className="text-sm font-medium">{imobiliaria.totalFiancas}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor Total</p>
                      <p className="text-sm font-medium text-success">
                        R$ {imobiliaria.valorTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <p className="text-sm text-gray-500">Endereço</p>
                    <p className="text-sm text-gray-900">{imobiliaria.endereco}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="mr-2 h-4 w-4" />
                      Ligar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      E-mail
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

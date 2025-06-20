
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  Bell,
  Lock,
  Save
} from 'lucide-react';

const ConfiguracoesJuridico = () => {
  const [formData, setFormData] = useState({
    razaoSocial: 'Departamento Jurídico LocarPay',
    cnpj: '12.345.678/0001-90',
    email: 'juridico@locarpay.com',
    telefone: '(11) 3456-7890',
    endereco: 'Rua Augusta, 1000 - São Paulo, SP',
    cep: '01305-100',
    responsavel: 'Dr. Carlos Silva',
    oab: 'SP 123456',
    emailNotificacoes: true,
    smsNotificacoes: false,
    notificacoesPrazos: true,
    notificacoesProcessos: true,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Salvando configurações:', formData);
  };

  return (
    <Layout title="Configurações">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Gerencie as configurações do departamento jurídico</p>
          </div>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>

        {/* Informações da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Informações do Departamento
            </CardTitle>
            <CardDescription>
              Dados básicos do departamento jurídico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input
                  id="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={(e) => handleInputChange('razaoSocial', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsável Jurídico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Responsável Jurídico
            </CardTitle>
            <CardDescription>
              Informações do responsável técnico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsavel">Nome do Responsável</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={(e) => handleInputChange('responsavel', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oab">Número da OAB</Label>
                <Input
                  id="oab"
                  value={formData.oab}
                  onChange={(e) => handleInputChange('oab', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure suas preferências de notificação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">E-mail</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações por e-mail
                </p>
              </div>
              <Switch
                checked={formData.emailNotificacoes}
                onCheckedChange={(checked) => handleInputChange('emailNotificacoes', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações por SMS
                </p>
              </div>
              <Switch
                checked={formData.smsNotificacoes}
                onCheckedChange={(checked) => handleInputChange('smsNotificacoes', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Prazos Processuais</Label>
                <p className="text-sm text-muted-foreground">
                  Alertas sobre prazos importantes
                </p>
              </div>
              <Switch
                checked={formData.notificacoesPrazos}
                onCheckedChange={(checked) => handleInputChange('notificacoesPrazos', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Novos Processos</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações sobre novos processos
                </p>
              </div>
              <Switch
                checked={formData.notificacoesProcessos}
                onCheckedChange={(checked) => handleInputChange('notificacoesProcessos', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Alterar Senha
            </Button>
            <Button variant="outline" className="w-full">
              Configurar Autenticação em Duas Etapas
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ConfiguracoesJuridico;

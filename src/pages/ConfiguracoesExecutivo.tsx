
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Eye,
  Save,
  Camera
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const ConfiguracoesExecutivo = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    telefone: '(11) 99999-9999',
    empresa: 'LocarPay',
    cargo: 'Executivo de Contas',
    bio: 'Executivo especializado em relacionamento com imobiliárias e desenvolvimento de novos negócios.',
    meta_mensal: '20',
    comissao: '5',
    regiao: 'São Paulo',
  });

  const [notifications, setNotifications] = useState({
    email_vendas: true,
    email_metas: true,
    push_negociacoes: true,
    sms_urgentes: false,
  });

  const [privacy, setPrivacy] = useState({
    perfil_publico: true,
    mostrar_performance: true,
    compartilhar_dados: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as configurações
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  const handlePasswordChange = () => {
    // Implementar mudança de senha
    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso.",
    });
  };

  return (
    <Layout title="Configurações">
      <div className="space-y-6 animate-fade-in">
        {/* Golden Banner */}
        <div className="bg-gradient-to-r from-[#F4D573] via-[#E6C46E] to-[#BC942C] rounded-lg p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-[#0C1C2E]" />
            <div>
              <h1 className="text-2xl font-bold text-[#0C1C2E]">Configurações da Conta</h1>
              <p className="text-[#0C1C2E]/80">Gerencie suas informações pessoais e preferências</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Perfil */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Atualize suas informações básicas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="regiao">Região de Atuação</Label>
                    <Select value={formData.regiao} onValueChange={(value) => handleInputChange('regiao', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="São Paulo">São Paulo</SelectItem>
                        <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                        <SelectItem value="Belo Horizonte">Belo Horizonte</SelectItem>
                        <SelectItem value="Salvador">Salvador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="empresa">Empresa</Label>
                    <Input
                      id="empresa"
                      value={formData.empresa}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                      id="cargo"
                      value={formData.cargo}
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Conte um pouco sobre sua experiência..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="meta_mensal">Meta Mensal (Fianças)</Label>
                    <Input
                      id="meta_mensal"
                      type="number"
                      value={formData.meta_mensal}
                      onChange={(e) => handleInputChange('meta_mensal', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="comissao">Comissão (%)</Label>
                    <Input
                      id="comissao"
                      type="number"
                      value={formData.comissao}
                      disabled
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
                  Configure como deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>E-mail sobre vendas</Label>
                    <p className="text-sm text-gray-600">Receba notificações sobre novas vendas</p>
                  </div>
                  <Switch
                    checked={notifications.email_vendas}
                    onCheckedChange={(checked) => handleNotificationChange('email_vendas', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>E-mail sobre metas</Label>
                    <p className="text-sm text-gray-600">Relatórios mensais de performance</p>
                  </div>
                  <Switch
                    checked={notifications.email_metas}
                    onCheckedChange={(checked) => handleNotificationChange('email_metas', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push sobre negociações</Label>
                    <p className="text-sm text-gray-600">Notificações push sobre negociações</p>
                  </div>
                  <Switch
                    checked={notifications.push_negociacoes}
                    onCheckedChange={(checked) => handleNotificationChange('push_negociacoes', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS urgentes</Label>
                    <p className="text-sm text-gray-600">SMS para situações urgentes</p>
                  </div>
                  <Switch
                    checked={notifications.sms_urgentes}
                    onCheckedChange={(checked) => handleNotificationChange('sms_urgentes', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacidade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Privacidade
                </CardTitle>
                <CardDescription>
                  Controle a visibilidade das suas informações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Perfil público</Label>
                    <p className="text-sm text-gray-600">Permitir que outros vejam seu perfil</p>
                  </div>
                  <Switch
                    checked={privacy.perfil_publico}
                    onCheckedChange={(checked) => handlePrivacyChange('perfil_publico', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mostrar performance</Label>
                    <p className="text-sm text-gray-600">Exibir suas métricas de performance</p>
                  </div>
                  <Switch
                    checked={privacy.mostrar_performance}
                    onCheckedChange={(checked) => handlePrivacyChange('mostrar_performance', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compartilhar dados</Label>
                    <p className="text-sm text-gray-600">Permitir uso de dados para análises</p>
                  </div>
                  <Switch
                    checked={privacy.compartilhar_dados}
                    onCheckedChange={(checked) => handlePrivacyChange('compartilhar_dados', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E] text-2xl font-bold">
                      {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Alterar Foto
                  </Button>
                  <div className="text-center">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-600">Executivo de Contas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleSave}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handlePasswordChange}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Alterar Senha
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Imobiliárias</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fianças do Mês</span>
                  <span className="font-medium">25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Meta Atingida</span>
                  <span className="font-medium text-success">125%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Receita Mensal</span>
                  <span className="font-medium">R$ 174K</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfiguracoesExecutivo;

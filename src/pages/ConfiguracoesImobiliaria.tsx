
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import Layout from '@/components/Layout';
import ImageUpload from '@/components/ImageUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  User, 
  Bell, 
  Shield, 
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const ConfiguracoesImobiliaria = () => {
  const { user, updateUser } = useAuth();
  const { profile, updateProfile, updateUserData, updatePassword, loading } = useUserProfile();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Dados da empresa (perfil_usuario)
    nome_empresa: '',
    cnpj: '',
    endereco_completo: '',
    
    // Dados pessoais (usuarios)
    nome: user?.name || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    imagem_perfil: user?.imagem_perfil || '',
    
    // Segurança
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Notificações
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    monthlyReports: true
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        nome_empresa: profile.nome_empresa || '',
        cnpj: profile.cnpj || '',
        endereco_completo: profile.endereco_completo || ''
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.name || '',
        email: user.email || '',
        telefone: user.telefone || '',
        imagem_perfil: user.imagem_perfil || ''
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCompanyData = async () => {
    const success = await updateProfile({
      nome_empresa: formData.nome_empresa,
      cnpj: formData.cnpj,
      endereco_completo: formData.endereco_completo
    });

    if (success) {
      toast({
        title: "Dados da empresa atualizados!",
        description: "As informações da empresa foram salvas com sucesso.",
      });
    }
  };

  const handleSavePersonalData = async () => {
    const success = await updateUserData({
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone
    });

    if (success && user) {
      // Atualizar o contexto do usuário
      updateUser({
        ...user,
        name: formData.nome,
        email: formData.email,
        telefone: formData.telefone
      });
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro ao alterar senha",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    const success = await updatePassword(formData.currentPassword, formData.newPassword);
    
    if (success) {
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
  };

  const handleImageChange = async (imageUrl: string) => {
    // Aqui você atualizaria a imagem no banco de dados
    // Por enquanto, apenas atualiza o estado local
    setFormData(prev => ({ ...prev, imagem_perfil: imageUrl }));
    
    if (user) {
      updateUser({
        ...user,
        imagem_perfil: imageUrl
      });
    }
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Preferências salvas!",
      description: "Suas preferências de notificação foram atualizadas.",
    });
  };

  return (
    <Layout title="Configurações">
      <div className="space-y-6 animate-fade-in">
        {/* Profile Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Foto de Perfil
            </CardTitle>
            <CardDescription>
              Atualize sua foto de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              currentImage={formData.imagem_perfil}
              onImageChange={handleImageChange}
              userName={formData.nome}
            />
          </CardContent>
        </Card>

        {/* Company Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5 text-primary" />
              Dados da Empresa
            </CardTitle>
            <CardDescription>
              Informações básicas da sua imobiliária
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome_empresa">Nome da Empresa/Imobiliária</Label>
                <Input
                  id="nome_empresa"
                  value={formData.nome_empresa}
                  onChange={(e) => handleInputChange('nome_empresa', e.target.value)}
                  placeholder="Nome da sua imobiliária"
                />
              </div>
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="endereco_completo">Endereço Completo</Label>
              <Textarea
                id="endereco_completo"
                value={formData.endereco_completo}
                onChange={(e) => handleInputChange('endereco_completo', e.target.value)}
                placeholder="Endereço completo da empresa"
                rows={3}
              />
            </div>
            
            <Button 
              onClick={handleSaveCompanyData} 
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar Dados da Empresa'}
            </Button>
          </CardContent>
        </Card>

        {/* Personal Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-success" />
              Dados Pessoais
            </CardTitle>
            <CardDescription>
              Informações do responsável pela conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <Button 
              onClick={handleSavePersonalData} 
              disabled={loading}
              className="bg-success hover:bg-success/90"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar Dados Pessoais'}
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-warning" />
              Segurança
            </CardTitle>
            <CardDescription>
              Altere sua senha de acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  placeholder="Digite sua senha atual"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  placeholder="Digite sua nova senha"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirme sua nova senha"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleChangePassword} 
              disabled={loading}
              className="bg-warning hover:bg-warning/90 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" style={{ color: '#BC942C' }} />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure suas preferências de notificação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por E-mail</p>
                <p className="text-sm text-gray-600">Receber notificações importantes por e-mail</p>
              </div>
              <Switch
                checked={formData.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por SMS</p>
                <p className="text-sm text-gray-600">Receber alertas urgentes por SMS</p>
              </div>
              <Switch
                checked={formData.smsNotifications}
                onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Relatórios Semanais</p>
                <p className="text-sm text-gray-600">Receber resumo semanal de atividades</p>
              </div>
              <Switch
                checked={formData.weeklyReports}
                onCheckedChange={(checked) => handleInputChange('weeklyReports', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Relatórios Mensais</p>
                <p className="text-sm text-gray-600">Receber relatório mensal detalhado</p>
              </div>
              <Switch
                checked={formData.monthlyReports}
                onCheckedChange={(checked) => handleInputChange('monthlyReports', checked)}
              />
            </div>
            
            <Button onClick={handleSaveNotifications} style={{ backgroundColor: '#BC942C' }} className="hover:opacity-90 text-white">
              <Save className="mr-2 h-4 w-4" />
              Salvar Preferências
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ConfiguracoesImobiliaria;

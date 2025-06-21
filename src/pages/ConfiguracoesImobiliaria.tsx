
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
import Layout from '@/components/Layout';
import ImageUpload from '@/components/ImageUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  
  // Usar o hook de formatação de telefone
  const phoneFormatter = usePhoneFormatter(user?.telefone || '');
  
  const [formData, setFormData] = useState({
    // Dados da empresa (perfil_usuario)
    nome_empresa: '',
    cnpj: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    
    // Dados pessoais (usuarios)
    nome: user?.name || '',
    email: user?.email || '',
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
        endereco: profile.endereco || '',
        numero: profile.numero || '',
        complemento: profile.complemento || '',
        bairro: profile.bairro || '',
        cidade: profile.cidade || '',
        estado: profile.estado || '',
        pais: profile.pais || 'Brasil'
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.name || '',
        email: user.email || '',
        imagem_perfil: user.imagem_perfil || ''
      }));
      
      if (user.telefone) {
        phoneFormatter.setFormattedValue(phoneFormatter.formatPhone(user.telefone));
      }
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCompanyData = async () => {
    // Validar campos obrigatórios
    const requiredFields = ['nome_empresa', 'cnpj', 'endereco', 'numero', 'bairro', 'cidade', 'estado'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos da empresa são obrigatórios para imobiliárias.",
        variant: "destructive",
      });
      return;
    }

    const success = await updateProfile({
      nome_empresa: formData.nome_empresa,
      cnpj: formData.cnpj,
      endereco: formData.endereco,
      numero: formData.numero,
      complemento: formData.complemento,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      pais: formData.pais
    });

    if (success) {
      toast({
        title: "Dados da empresa atualizados!",
        description: "As informações da empresa foram salvas com sucesso.",
      });
    }
  };

  const handleSavePersonalData = async () => {
    // Validar telefone
    if (!phoneFormatter.isValid()) {
      toast({
        title: "Telefone inválido",
        description: "O telefone deve ter 13 dígitos e começar com 55.",
        variant: "destructive",
      });
      return;
    }

    const success = await updateUserData({
      nome: formData.nome,
      email: formData.email,
      telefone: phoneFormatter.getUnformattedValue()
    });

    if (success && user) {
      updateUser({
        ...user,
        name: formData.nome,
        email: formData.email,
        telefone: phoneFormatter.getUnformattedValue()
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
    setFormData(prev => ({ ...prev, imagem_perfil: imageUrl }));
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
              Informações básicas da sua imobiliária (Todos os campos são obrigatórios)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome_empresa">Nome da Empresa/Imobiliária *</Label>
                <Input
                  id="nome_empresa"
                  value={formData.nome_empresa}
                  onChange={(e) => handleInputChange('nome_empresa', e.target.value)}
                  placeholder="Nome da sua imobiliária"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  placeholder="Rua, Avenida, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={formData.complemento}
                  onChange={(e) => handleInputChange('complemento', e.target.value)}
                  placeholder="Sala, Andar, etc."
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                  placeholder="Nome do bairro"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  placeholder="Nome da cidade"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estado">Estado *</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  placeholder="Ex: São Paulo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pais">País</Label>
                <Input
                  id="pais"
                  value={formData.pais}
                  disabled
                  className="bg-gray-100"
                />
              </div>
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
              <Label htmlFor="telefone">Telefone (13 dígitos, iniciando com 55)</Label>
              <Input
                id="telefone"
                value={phoneFormatter.formattedValue}
                onChange={(e) => phoneFormatter.handleChange(e.target.value)}
                placeholder="+55 (11) 9 9999-9999"
                className={!phoneFormatter.isValid() && phoneFormatter.formattedValue !== '+' ? 'border-red-500' : ''}
              />
              {!phoneFormatter.isValid() && phoneFormatter.formattedValue !== '+' && (
                <p className="text-red-500 text-sm mt-1">
                  Telefone deve ter 13 dígitos e começar com 55
                </p>
              )}
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

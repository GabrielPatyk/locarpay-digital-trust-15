
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
import { useMaintenanceMode } from '@/hooks/useMaintenanceMode';
import Layout from '@/components/Layout';
import ImageUpload from '@/components/ImageUpload';
import ConfirmationModal from '@/components/ConfirmationModal';
import StatusPlataforma from '@/components/StatusPlataforma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Bell, 
  Shield, 
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileCheck
} from 'lucide-react';

const ConfiguracoesAdmin = () => {
  const { user, updateUser } = useAuth();
  const { profile, updateProfile, updateUserData, updatePassword, loading } = useUserProfile();
  const { formatPhone, unformatPhone, isValidPhone } = usePhoneFormatter();
  const { toast } = useToast();
  const { isMaintenanceMode, maintenanceReason, updateMaintenanceMode } = useMaintenanceMode();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPersonalConfirmation, setShowPersonalConfirmation] = useState(false);
  const [pendingPersonalChanges, setPendingPersonalChanges] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Dados pessoais - campos vazios para edição
    nome: '',
    email: '',
    telefone: '',
    imagem_perfil: user?.imagem_perfil || '',
    
    // Segurança
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Notificações
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    monthlyReports: true,
    
    // Manutenção
    manutencaoAtiva: isMaintenanceMode,
    motivoManutencao: maintenanceReason || 'Sistema em manutenção programada'
  });

  // Sincronizar estado de manutenção
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      manutencaoAtiva: isMaintenanceMode,
      motivoManutencao: maintenanceReason || 'Sistema em manutenção programada'
    }));
  }, [isMaintenanceMode, maintenanceReason]);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'telefone') {
      setFormData(prev => ({
        ...prev,
        [field]: formatPhone(value as string)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSavePersonalData = async () => {
    // Preparar dados para confirmação
    const changes = {
      'Nome Completo': formData.nome || '(não alterado)',
      'E-mail': formData.email || '(não alterado)',
      'Telefone': formData.telefone || '(não alterado)'
    };

    setPendingPersonalChanges(changes);
    setShowPersonalConfirmation(true);
  };

  const confirmPersonalChanges = async () => {
    // Filtrar apenas campos preenchidos
    const updateData: any = {};
    
    if (formData.nome.trim()) updateData.nome = formData.nome;
    if (formData.email.trim()) updateData.email = formData.email;
    if (formData.telefone.trim()) {
      if (!isValidPhone(formData.telefone)) {
        toast({
          title: "Telefone inválido",
          description: "O telefone deve ter 13 dígitos e começar com +55.",
          variant: "destructive",
        });
        return;
      }
      updateData.telefone = unformatPhone(formData.telefone);
    }

    const success = await updateUserData(updateData);

    if (success && user) {
      // Atualizar o contexto do usuário
      updateUser({
        ...user,
        name: updateData.nome || user.name,
        email: updateData.email || user.email,
        telefone: updateData.telefone || user.telefone
      });
      setShowPersonalConfirmation(false);
      // Limpar os campos após salvar
      setFormData(prev => ({
        ...prev,
        nome: '',
        email: '',
        telefone: ''
      }));
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
    if (user) {
      updateUser({ ...user, imagem_perfil: imageUrl });
    }
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
              currentImage={user?.imagem_perfil || ''}
              onImageChange={handleImageChange}
              userName={user?.name || 'Usuário'}
            />
          </CardContent>
        </Card>

        {/* Account Verifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileCheck className="mr-2 h-5 w-5 text-primary" />
              Verificações de Conta
            </CardTitle>
            <CardDescription>
              Status das verificações da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">E-mail Verificado</p>
                <p className="text-sm text-gray-600">Status de verificação do seu e-mail</p>
              </div>
              <Badge className={user?.verificado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {user?.verificado ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verificado
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1 h-3 w-3" />
                    Não Verificado
                  </>
                )}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Conta Ativa</p>
                <p className="text-sm text-gray-600">Status da sua conta no sistema</p>
              </div>
              <Badge className={user?.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {user?.ativo ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Ativa
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1 h-3 w-3" />
                    Inativa
                  </>
                )}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Perfil Administrativo</p>
                <p className="text-sm text-gray-600">Status do seu perfil de administrador</p>
              </div>
              <Badge className={user?.type === 'admin' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {user?.type === 'admin' ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Administrador
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {user?.type || 'Não Definido'}
                  </>
                )}
              </Badge>
            </div>
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
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder={user?.name || "Seu nome completo"}
                />
                {user?.name && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {user.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={user?.email || "seu@email.com"}
                />
                {user?.email && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {user.email}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder={user?.telefone ? formatPhone(user.telefone) : "+55 (11) 9 9999-9999"}
              />
              {user?.telefone && (
                <p className="text-xs text-gray-500 mt-1">Atual: {formatPhone(user.telefone)}</p>
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

        {/* Manutenção Plataforma */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-warning" />
              Manutenção Plataforma
            </CardTitle>
            <CardDescription>
              Configure o modo de manutenção da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Modo Manutenção</p>
                <p className="text-sm text-gray-600">Ativar modo de manutenção para toda a plataforma</p>
              </div>
              <Switch 
                checked={formData.manutencaoAtiva || false} 
                onCheckedChange={(checked) => handleInputChange('manutencaoAtiva', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="motivoManutencao">Motivo da Manutenção</Label>
              <Textarea
                id="motivoManutencao"
                value={formData.motivoManutencao}
                onChange={(e) => handleInputChange('motivoManutencao', e.target.value)}
                placeholder="Descreva o motivo da manutenção que será exibido para os usuários"
                rows={3}
              />
              <p className="text-xs text-gray-500">Este texto será exibido na página de manutenção para os usuários</p>
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Atenção!</p>
                  <p>Quando o modo manutenção estiver ativo, todos os usuários (exceto administradores) serão redirecionados para uma página de manutenção.</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={async () => {
                const success = await updateMaintenanceMode(
                  formData.manutencaoAtiva, 
                  formData.motivoManutencao
                );
                if (success) {
                  toast({
                    title: "Configurações salvas",
                    description: `Modo manutenção ${formData.manutencaoAtiva ? 'ativado' : 'desativado'} com sucesso.`,
                  });
                } else {
                  toast({
                    title: "Erro ao salvar",
                    description: "Não foi possível alterar o modo manutenção.",
                    variant: "destructive",
                  });
                }
              }}
              disabled={loading}
              className="bg-warning hover:bg-warning/90 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications - Bloqueada */}
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" style={{ color: '#BC942C' }} />
              Notificações
              <AlertTriangle className="ml-2 h-4 w-4 text-red-500" />
            </CardTitle>
            <CardDescription>
              <span className="text-red-600 font-medium">Esta opção ainda está em desenvolvimento</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pointer-events-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por E-mail</p>
                <p className="text-sm text-gray-600">Receber notificações importantes por e-mail</p>
              </div>
              <Switch
                checked={formData.emailNotifications}
                disabled
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por SMS</p>
                <p className="text-sm text-gray-600">Receber alertas urgentes por SMS</p>
              </div>
              <Switch
                checked={formData.smsNotifications}
                disabled
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Relatórios Semanais</p>
                <p className="text-sm text-gray-600">Receber resumo semanal de atividades</p>
              </div>
              <Switch
                checked={formData.weeklyReports}
                disabled
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Relatórios Mensais</p>
                <p className="text-sm text-gray-600">Receber relatório mensal detalhado</p>
              </div>
              <Switch
                checked={formData.monthlyReports}
                disabled
              />
            </div>
            
            <Button 
              disabled
              style={{ backgroundColor: '#BC942C' }} 
              className="hover:opacity-90 text-white opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Preferências
            </Button>
          </CardContent>
        </Card>

        {/* Status da Plataforma */}
        <StatusPlataforma />

        {/* Modal de Confirmação */}
        <ConfirmationModal
          isOpen={showPersonalConfirmation}
          onClose={() => setShowPersonalConfirmation(false)}
          onConfirm={confirmPersonalChanges}
          title="Confirmar Alterações - Dados Pessoais"
          description="Você está prestes a alterar seus dados pessoais. Confirme as informações abaixo:"
          changes={pendingPersonalChanges}
          isLoading={loading}
        />
      </div>
    </Layout>
  );
};

export default ConfiguracoesAdmin;

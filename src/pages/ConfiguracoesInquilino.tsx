
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from '@/components/ImageUpload';
import { User, Lock, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const personalInfoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  cidade: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  estado: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
  pais: z.string().min(2, 'País deve ter pelo menos 2 caracteres'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Senha atual deve ter pelo menos 6 caracteres'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação da senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const ConfiguracoesInquilino = () => {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const { profile, updateProfile, loading } = useUserProfile();
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [currentImage, setCurrentImage] = useState(user?.imagem_perfil || '');

  const personalForm = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      nome: user?.name || '',
      telefone: user?.telefone || '',
      endereco: profile?.endereco || '',
      numero: profile?.numero || '',
      complemento: profile?.complemento || '',
      bairro: profile?.bairro || '',
      cidade: profile?.cidade || '',
      estado: profile?.estado || '',
      pais: profile?.pais || 'Brasil',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onPersonalInfoSubmit = async (data: PersonalInfoForm) => {
    try {
      // Atualizar dados do usuário na tabela usuarios
      const { error: userError } = await supabase
        .from('usuarios')
        .update({
          nome: data.nome,
          telefone: data.telefone,
        })
        .eq('id', user?.id);

      if (userError) throw userError;

      // Atualizar perfil do usuário
      const profileData = {
        endereco: data.endereco,
        numero: data.numero,
        complemento: data.complemento || null,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        pais: data.pais,
      };

      await updateProfile(profileData);

      // Atualizar contexto do usuário
      updateUser({
        ...user!,
        name: data.nome,
        telefone: data.telefone,
      });

      toast({
        title: "Sucesso!",
        description: "Informações pessoais atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar informações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as informações.",
        variant: "destructive",
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      setIsUpdatingPassword(true);

      // Verificar senha atual
      const { data: loginData } = await supabase.rpc('validar_login', {
        email_input: user?.email,
        senha_input: data.currentPassword,
      });

      if (!loginData || loginData.length === 0) {
        toast({
          title: "Erro",
          description: "Senha atual incorreta.",
          variant: "destructive",
        });
        return;
      }

      // Atualizar senha
      const { data: hashedPassword } = await supabase.rpc('hash_password', {
        password: data.newPassword,
      });

      const { error } = await supabase
        .from('usuarios')
        .update({ senha: hashedPassword })
        .eq('id', user?.id);

      if (error) throw error;

      passwordForm.reset();
      toast({
        title: "Sucesso!",
        description: "Senha alterada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a senha.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleImageChange = (imageUrl: string) => {
    setCurrentImage(imageUrl);
  };

  if (loading) {
    return (
      <Layout title="Configurações">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Configurações">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Informações Pessoais</span>
              <span className="sm:hidden">Pessoal</span>
            </TabsTrigger>
            <TabsTrigger value="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Endereço</span>
              <span className="sm:hidden">Endereço</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Segurança</span>
              <span className="sm:hidden">Senha</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e foto de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <ImageUpload
                    currentImage={currentImage}
                    onImageChange={handleImageChange}
                    userName={user?.name}
                  />
                </div>

                <Form {...personalForm}>
                  <form onSubmit={personalForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={personalForm.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={personalForm.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>CPF</Label>
                      <Input
                        value={(user as any)?.cpf || 'Não informado'}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500">
                        O CPF não pode ser alterado após o cadastro
                      </p>
                    </div>

                    <Button type="submit" className="w-full sm:w-auto">
                      Salvar Informações Pessoais
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>
                  Mantenha seu endereço atualizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...personalForm}>
                  <form onSubmit={personalForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={personalForm.control}
                        name="endereco"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Rua, Avenida, etc." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={personalForm.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={personalForm.control}
                        name="complemento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Opcional" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={personalForm.control}
                        name="bairro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={personalForm.control}
                        name="cidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={personalForm.control}
                        name="estado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={personalForm.control}
                        name="pais"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>País</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full sm:w-auto">
                      Salvar Endereço
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Mantenha sua conta segura com uma senha forte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha Atual</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isUpdatingPassword}
                      className="w-full sm:w-auto"
                    >
                      {isUpdatingPassword ? 'Alterando...' : 'Alterar Senha'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ConfiguracoesInquilino;

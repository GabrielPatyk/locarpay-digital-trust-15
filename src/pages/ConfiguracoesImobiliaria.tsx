
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Building, User } from 'lucide-react';

const ConfiguracoesImobiliaria = () => {
  const { user } = useAuth();
  const { profile, refetch } = useUserProfile();
  const { toast } = useToast();
  
  // Estados para dados pessoais
  const [dadosPessoais, setDadosPessoais] = useState({
    nome: '',
    email: '',
    telefone: ''
  });
  
  // Estados para dados da empresa
  const [dadosEmpresa, setDadosEmpresa] = useState({
    nomeEmpresa: '',
    cnpj: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'Brasil'
  });

  const [isLoadingPessoais, setIsLoadingPessoais] = useState(false);
  const [isLoadingEmpresa, setIsLoadingEmpresa] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setDadosEmpresa({
        nomeEmpresa: profile.nome_empresa || '',
        cnpj: profile.cnpj || '',
        endereco: profile.endereco || '',
        numero: profile.numero || '',
        complemento: profile.complemento || '',
        bairro: profile.bairro || '',
        cidade: profile.cidade || '',
        estado: profile.estado || '',
        pais: profile.pais || 'Brasil'
      });
    }
  }, [profile]);

  const handleSaveDadosPessoais = async () => {
    if (!user?.id) return;
    
    setIsLoadingPessoais(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome: dadosPessoais.nome,
          email: dadosPessoais.email,
          telefone: dadosPessoais.telefone
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Dados pessoais atualizados!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao salvar dados pessoais:', error);
      toast({
        title: "Erro ao salvar dados pessoais",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPessoais(false);
    }
  };

  const handleSaveDadosEmpresa = async () => {
    if (!user?.id) return;
    
    setIsLoadingEmpresa(true);
    try {
      const profileData = {
        usuario_id: user.id,
        nome_empresa: dadosEmpresa.nomeEmpresa,
        cnpj: dadosEmpresa.cnpj,
        endereco: dadosEmpresa.endereco,
        numero: dadosEmpresa.numero,
        complemento: dadosEmpresa.complemento || null,
        bairro: dadosEmpresa.bairro,
        cidade: dadosEmpresa.cidade,
        estado: dadosEmpresa.estado,
        pais: dadosEmpresa.pais
      };

      const { error } = await supabase
        .from('perfil_usuario')
        .upsert(profileData, { 
          onConflict: 'usuario_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      toast({
        title: "Dados da empresa atualizados!",
        description: "As informações da empresa foram salvas com sucesso.",
      });
      
      refetch();
    } catch (error: any) {
      console.error('Erro ao salvar dados da empresa:', error);
      toast({
        title: "Erro ao salvar dados da empresa",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEmpresa(false);
    }
  };

  return (
    <Layout title="Configurações">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] rounded-lg p-6 text-[#0C1C2E]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Configurações da Imobiliária</h1>
              <p className="opacity-90">Gerencie suas informações pessoais e da empresa</p>
            </div>
            <Settings className="h-12 w-12 opacity-50" />
          </div>
        </div>

        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Dados Pessoais
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={dadosPessoais.nome}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={dadosPessoais.email}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Digite seu e-mail"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={dadosPessoais.telefone}
                onChange={(e) => setDadosPessoais(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="Digite seu telefone"
              />
            </div>
            <Button 
              onClick={handleSaveDadosPessoais}
              disabled={isLoadingPessoais}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoadingPessoais ? 'Salvando...' : 'Salvar Dados Pessoais'}
            </Button>
          </CardContent>
        </Card>

        {/* Dados da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5 text-primary" />
              Dados da Empresa
            </CardTitle>
            <CardDescription>
              Preencha as informações da sua imobiliária
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                <Input
                  id="nomeEmpresa"
                  value={dadosEmpresa.nomeEmpresa}
                  onChange={(e) => setDadosEmpresa(prev => ({ ...prev, nomeEmpresa: e.target.value }))}
                  placeholder="Digite o nome da empresa"
                />
              </div>
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={dadosEmpresa.cnpj}
                  onChange={(e) => setDadosEmpresa(prev => ({ ...prev, cnpj: e.target.value }))}
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={dadosEmpresa.endereco}
                  onChange={(e) => setDadosEmpresa(prev => ({ ...prev, endereco: e.target.value }))}
                  placeholder="Rua, Avenida, etc."
                />
              </div>
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={dadosEmpresa.numero}
                  onChange={(e) => setDadosEmpresa(prev => ({ ...prev, numero: e.target.value }))}
                  placeholder="123"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={dadosEmpresa.complemento}
                onChange={(e) => setDadosEmpresa(prev => ({ ...prev, complemento: e.target.value }))}
                placeholder="Apto, Sala, etc."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={dadosEmpresa.bairro}
                  onChange={(e) => setDadosEmpresa(prev => ({ ...prev, bairro: e.target.value }))}
                  placeholder="Centro"
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={dadosEmpresa.cidade}
                  onChange={(e) => setDadosEmpresa(prev => ({ ...prev, cidade: e.target.value }))}
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={dadosEmpresa.estado}
                  onChange={(e) => setDadosEmpresa(prev => ({ ...prev, estado: e.target.value }))}
                  placeholder="SP"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="pais">País</Label>
              <Input
                id="pais"
                value={dadosEmpresa.pais}
                readOnly
                className="bg-gray-100"
              />
            </div>
            
            <Button 
              onClick={handleSaveDadosEmpresa}
              disabled={isLoadingEmpresa}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoadingEmpresa ? 'Salvando...' : 'Salvar Dados da Empresa'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ConfiguracoesImobiliaria;

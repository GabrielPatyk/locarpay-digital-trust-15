
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CompletarCadastro = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome_completo: '',
    tipo_usuario: '' as 'inquilino' | 'analista' | 'juridico' | 'admin' | 'sdr' | 'executivo' | 'imobiliaria' | 'financeiro' | '',
    documento: '',
    telefone: '',
    data_nascimento: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado. Faça login novamente.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.nome_completo || !formData.tipo_usuario) {
      toast({
        title: "Erro",
        description: "Nome completo e tipo de usuário são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          nome_completo: formData.nome_completo,
          tipo_usuario: formData.tipo_usuario,
          documento: formData.documento || null,
          telefone: formData.telefone || null,
          data_nascimento: formData.data_nascimento || null
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar perfil:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar perfil. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      updateProfile(data);
      
      toast({
        title: "Sucesso!",
        description: "Cadastro completado com sucesso.",
      });

      // Redirect based on user type
      const redirectPaths = {
        inquilino: '/inquilino',
        imobiliaria: '/imobiliaria',
        analista: '/analista',
        juridico: '/juridico',
        sdr: '/sdr',
        executivo: '/executivo',
        financeiro: '/financeiro',
        admin: '/dashboard'
      };

      navigate(redirectPaths[formData.tipo_usuario] || '/dashboard');
      
    } catch (error) {
      console.error('Erro ao completar cadastro:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">Completar Cadastro</CardTitle>
          <p className="text-center text-sm text-gray-600">
            Para continuar, precisamos de algumas informações adicionais
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome_completo">Nome Completo *</Label>
              <Input
                id="nome_completo"
                type="text"
                value={formData.nome_completo}
                onChange={(e) => setFormData(prev => ({ ...prev, nome_completo: e.target.value }))}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div>
              <Label htmlFor="tipo_usuario">Tipo de Usuário *</Label>
              <Select 
                value={formData.tipo_usuario} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_usuario: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inquilino">Inquilino</SelectItem>
                  <SelectItem value="imobiliaria">Imobiliária</SelectItem>
                  <SelectItem value="analista">Analista</SelectItem>
                  <SelectItem value="juridico">Jurídico</SelectItem>
                  <SelectItem value="sdr">SDR</SelectItem>
                  <SelectItem value="executivo">Executivo</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="documento">CPF/CNPJ</Label>
              <Input
                id="documento"
                type="text"
                value={formData.documento}
                onChange={(e) => setFormData(prev => ({ ...prev, documento: e.target.value }))}
                placeholder="Digite seu CPF ou CNPJ"
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="Digite seu telefone"
              />
            </div>

            <div>
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData(prev => ({ ...prev, data_nascimento: e.target.value }))}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Completar Cadastro'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletarCadastro;

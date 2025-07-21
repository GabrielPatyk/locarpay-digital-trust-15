import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';

const EditarExecutivo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatPhone, unformatPhone } = usePhoneFormatter();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });

  const { data: executivo, isLoading } = useQuery({
    queryKey: ['executivo-edit', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .eq('cargo', 'executivo')
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (executivo) {
      setFormData({
        nome: executivo.nome || '',
        email: executivo.email || '',
        telefone: formatPhone(executivo.telefone || '')
      });
    }
  }, [executivo, formatPhone]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!id) throw new Error('ID não encontrado');

      const { error } = await supabase
        .from('usuarios')
        .update({
          nome: data.nome,
          email: data.email,
          telefone: unformatPhone(data.telefone)
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Dados do executivo atualizados com sucesso.",
      });
      navigate('/executivos-admin');
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: `Erro ao atualizar dados: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field === 'telefone') {
      value = formatPhone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Layout title="Editar Executivo">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Editar Executivo">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/executivos-admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Editar Executivo</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Dados do Executivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder={executivo?.nome || "Digite o nome completo"}
                  required
                />
                {executivo?.nome && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {executivo.nome}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={executivo?.email || "Digite o email"}
                  required
                />
                {executivo?.email && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {executivo.email}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone/WhatsApp</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder={executivo?.telefone ? formatPhone(executivo.telefone) : "+55 (00) 0 0000-0000"}
                />
                {executivo?.telefone && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {formatPhone(executivo.telefone)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/executivos-admin')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditarExecutivo;
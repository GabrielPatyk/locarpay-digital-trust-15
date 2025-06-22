
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, User } from 'lucide-react';

const ConfiguracoesFinanceiro = () => {
  const { toast } = useToast();
  
  const [dadosPessoais, setDadosPessoais] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  const salvarDados = () => {
    toast({
      title: "Dados salvos!",
      description: "Suas informações pessoais foram atualizadas com sucesso.",
    });
  };

  return (
    <Layout title="Configurações Pessoais">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Configurações Pessoais</h2>
          <Button onClick={salvarDados} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Salvar Alterações</span>
          </Button>
        </div>

        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Dados Pessoais</span>
            </CardTitle>
            <CardDescription>Mantenha seus dados pessoais sempre atualizados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Nome Completo</Label>
                <Input
                  value={dadosPessoais.nome}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={dadosPessoais.email}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Telefone</Label>
                <Input
                  value={dadosPessoais.telefone}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label>CPF</Label>
                <Input
                  value={dadosPessoais.cpf}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, cpf: e.target.value }))}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Label>Endereço</Label>
                <Input
                  value={dadosPessoais.endereco}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, endereco: e.target.value }))}
                  placeholder="Rua, Avenida..."
                />
              </div>
              <div>
                <Label>Número</Label>
                <Input
                  value={dadosPessoais.numero}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, numero: e.target.value }))}
                  placeholder="123"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Complemento</Label>
                <Input
                  value={dadosPessoais.complemento}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, complemento: e.target.value }))}
                  placeholder="Apto, Sala... (opcional)"
                />
              </div>
              <div>
                <Label>Bairro</Label>
                <Input
                  value={dadosPessoais.bairro}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, bairro: e.target.value }))}
                  placeholder="Nome do bairro"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Cidade</Label>
                <Input
                  value={dadosPessoais.cidade}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, cidade: e.target.value }))}
                  placeholder="Nome da cidade"
                />
              </div>
              <div>
                <Label>Estado</Label>
                <Input
                  value={dadosPessoais.estado}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, estado: e.target.value }))}
                  placeholder="SP"
                />
              </div>
              <div>
                <Label>CEP</Label>
                <Input
                  value={dadosPessoais.cep}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, cep: e.target.value }))}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ConfiguracoesFinanceiro;


import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  Eye, 
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  Loader2
} from 'lucide-react';

interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  renda: number;
  dataCadastro: string;
  totalFiancas: number;
  fiancasAprovadas: number;
  valorTotalAluguel: number;
  ultimaFianca?: string;
}

const Clientes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se é analista
  useEffect(() => {
    if (user && user.type !== 'analista') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  // Carregar clientes do banco de dados
  useEffect(() => {
    if (user?.type === 'analista') {
      fetchClientes();
    }
  }, [user]);

  const fetchClientes = async () => {
    try {
      // Buscar fianças aprovadas pelo analista logado
      const { data: fiancasAprovadas, error } = await supabase
        .from('historico_fiancas')
        .select(`
          fianca_id,
          fiancas_locaticias!inner(
            id,
            inquilino_nome_completo,
            inquilino_cpf,
            inquilino_email,
            inquilino_whatsapp,
            inquilino_endereco,
            inquilino_numero,
            inquilino_complemento,
            inquilino_bairro,
            inquilino_cidade,
            inquilino_estado,
            inquilino_renda_mensal,
            imovel_valor_aluguel,
            data_criacao,
            status_fianca
          )
        `)
        .eq('analisado_por', user.id)
        .eq('acao', 'Fiança aprovada');

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        return;
      }

      // Agrupar por inquilino
      const clientesMap = new Map<string, Cliente>();

      fiancasAprovadas?.forEach((item) => {
        const fianca = item.fiancas_locaticias;
        const cpf = fianca.inquilino_cpf;

        if (!clientesMap.has(cpf)) {
          clientesMap.set(cpf, {
            id: cpf,
            nome: fianca.inquilino_nome_completo,
            cpf: fianca.inquilino_cpf,
            email: fianca.inquilino_email,
            telefone: fianca.inquilino_whatsapp,
            endereco: `${fianca.inquilino_endereco}, ${fianca.inquilino_numero}${fianca.inquilino_complemento ? `, ${fianca.inquilino_complemento}` : ''}, ${fianca.inquilino_bairro}, ${fianca.inquilino_cidade} - ${fianca.inquilino_estado}`,
            renda: fianca.inquilino_renda_mensal,
            dataCadastro: fianca.data_criacao,
            totalFiancas: 0,
            fiancasAprovadas: 0,
            valorTotalAluguel: 0,
            ultimaFianca: fianca.data_criacao
          });
        }

        const cliente = clientesMap.get(cpf)!;
        cliente.totalFiancas += 1;
        if (fianca.status_fianca === 'aprovada' || fianca.status_fianca === 'ativa') {
          cliente.fiancasAprovadas += 1;
          cliente.valorTotalAluguel += fianca.imovel_valor_aluguel;
        }

        // Atualizar data da última fiança
        if (new Date(fianca.data_criacao) > new Date(cliente.ultimaFianca || '')) {
          cliente.ultimaFianca = fianca.data_criacao;
        }
      });

      setClientes(Array.from(clientesMap.values()));
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerDetalhes = (cliente: Cliente) => {
    // Criar modal ou página de detalhes do cliente
    console.log('Ver detalhes do cliente:', cliente);
    // Por enquanto, mostrar alert com informações
    alert(`Detalhes do Cliente:\n\nNome: ${cliente.nome}\nCPF: ${cliente.cpf}\nTotal de Fianças: ${cliente.totalFiancas}\nFianças Aprovadas: ${cliente.fiancasAprovadas}\nValor Total em Aluguéis: R$ ${cliente.valorTotalAluguel.toLocaleString('pt-BR')}`);
  };

  if (user?.type !== 'analista') {
    return (
      <Layout title="Acesso Negado">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Acesso restrito apenas para Analistas
          </h3>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Clientes">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600">Inquilinos das fianças aprovadas por você</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar clientes por nome, CPF ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-gray-600">Carregando clientes...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredClientes.map((cliente) => (
              <Card key={cliente.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                        <Badge className="bg-green-100 text-green-800">
                          {cliente.fiancasAprovadas} Fiança{cliente.fiancasAprovadas !== 1 ? 's' : ''} Aprovada{cliente.fiancasAprovadas !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Renda Mensal</p>
                      <p className="text-xl font-bold text-primary">
                        R$ {cliente.renda.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">CPF</p>
                        <p className="font-medium">{cliente.cpf}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{cliente.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Telefone</p>
                        <p className="font-medium">{cliente.telefone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Endereço</p>
                        <p className="font-medium">{cliente.endereco}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total de Fianças</p>
                        <p className="font-medium text-blue-600">{cliente.totalFiancas}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Valor Total Aluguéis</p>
                        <p className="font-medium text-green-600">R$ {cliente.valorTotalAluguel.toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Última Fiança</p>
                        <p className="font-medium">
                          {cliente.ultimaFianca ? new Date(cliente.ultimaFianca).toLocaleDateString('pt-BR') : 'Nunca'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Cliente desde {new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVerDetalhes(cliente)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredClientes.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum cliente encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente ajustar sua busca.'
                  : 'Os clientes das fianças aprovadas por você aparecerão aqui.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Clientes;

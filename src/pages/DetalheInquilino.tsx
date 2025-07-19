
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Shield
} from 'lucide-react';

interface InquilinoData {
  cpf: string;
  nome_completo: string;
  email: string;
  whatsapp: string;
  renda_mensal: number;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  data_cadastro: string;
  email_verificado: boolean;
  ativo: boolean;
}

interface FiancaInquilino {
  id: string;
  status_fianca: string;
  imovel_endereco: string;
  imovel_numero: string;
  imovel_bairro: string;
  imovel_cidade: string;
  imovel_valor_aluguel: number;
  data_criacao: string;
  data_analise?: string;
  score_credito?: number;
  taxa_aplicada?: number;
}

const DetalheInquilino = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [inquilino, setInquilino] = useState<InquilinoData | null>(null);
  const [fiancas, setFiancas] = useState<FiancaInquilino[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.type !== 'analista') {
      navigate('/unauthorized');
      return;
    }
    fetchInquilinoData();
  }, [id, user, navigate]);

  const fetchInquilinoData = async () => {
    try {
      if (!id) return;

      // Buscar dados do inquilino e suas fianças
      const { data: fiancasData, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .eq('inquilino_cpf', id)
        .eq('id_analista', user?.id);

      if (error) {
        console.error('Erro ao buscar dados do inquilino:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do inquilino.",
          variant: "destructive"
        });
        return;
      }

      if (!fiancasData || fiancasData.length === 0) {
        toast({
          title: "Inquilino não encontrado",
          description: "Este inquilino não possui fianças analisadas por você.",
          variant: "destructive"
        });
        navigate('/clientes');
        return;
      }

      // Usar dados da primeira fiança para montar os dados do inquilino
      const primeiraFianca = fiancasData[0];
      const inquilinoData: InquilinoData = {
        cpf: primeiraFianca.inquilino_cpf,
        nome_completo: primeiraFianca.inquilino_nome_completo,
        email: primeiraFianca.inquilino_email,
        whatsapp: primeiraFianca.inquilino_whatsapp,
        renda_mensal: primeiraFianca.inquilino_renda_mensal,
        endereco: primeiraFianca.inquilino_endereco,
        numero: primeiraFianca.inquilino_numero,
        complemento: primeiraFianca.inquilino_complemento,
        bairro: primeiraFianca.inquilino_bairro,
        cidade: primeiraFianca.inquilino_cidade,
        estado: primeiraFianca.inquilino_estado,
        pais: primeiraFianca.inquilino_pais,
        data_cadastro: primeiraFianca.data_criacao,
        email_verificado: false, // Assumindo false por não ter essa informação
        ativo: true // Assumindo true por padrão
      };

      const fiancasFormatadas: FiancaInquilino[] = fiancasData.map(fianca => ({
        id: fianca.id,
        status_fianca: fianca.status_fianca,
        imovel_endereco: fianca.imovel_endereco,
        imovel_numero: fianca.imovel_numero,
        imovel_bairro: fianca.imovel_bairro,
        imovel_cidade: fianca.imovel_cidade,
        imovel_valor_aluguel: fianca.imovel_valor_aluguel,
        data_criacao: fianca.data_criacao,
        data_analise: fianca.data_analise,
        score_credito: fianca.score_credito,
        taxa_aplicada: fianca.taxa_aplicada
      }));

      setInquilino(inquilinoData);
      setFiancas(fiancasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar os dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'em_analise': 'bg-blue-500',
      'aprovada': 'bg-green-500',
      'rejeitada': 'bg-red-500',
      'ativa': 'bg-green-500',
      'vencida': 'bg-red-500',
      'cancelada': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'em_analise': 'Em Análise',
      'aprovada': 'Aprovada',
      'rejeitada': 'Rejeitada',
      'ativa': 'Ativa',
      'vencida': 'Vencida',
      'cancelada': 'Cancelada'
    };
    return labels[status] || status;
  };

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 13 && numbers.startsWith('55')) {
      const areaCode = numbers.substring(2, 4);
      const firstDigit = numbers.substring(4, 5);
      const firstPart = numbers.substring(5, 9);
      const secondPart = numbers.substring(9, 13);
      return `+55 (${areaCode}) ${firstDigit} ${firstPart}-${secondPart}`;
    }
    return phone;
  };

  if (isLoading) {
    return (
      <Layout title="Detalhes do Inquilino">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!inquilino) {
    return (
      <Layout title="Inquilino não encontrado">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Inquilino não encontrado
          </h3>
          <Button onClick={() => navigate('/clientes')}>
            Voltar para Clientes
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Detalhes - ${inquilino.nome_completo}`}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/clientes')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{inquilino.nome_completo}</h1>
            <p className="text-gray-600">Detalhes do inquilino</p>
          </div>
        </div>

        {/* Cards de informações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                  <p className="text-base">{inquilino.nome_completo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">CPF</p>
                  <p className="text-base">{inquilino.cpf}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">E-mail</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-base">{inquilino.email}</span>
                    {inquilino.email_verificado ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">WhatsApp</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-base">{formatPhone(inquilino.whatsapp)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Renda Mensal</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-base font-medium text-green-600">
                      R$ {inquilino.renda_mensal.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={inquilino.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {inquilino.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Endereço Completo</p>
                <p className="text-base">
                  {inquilino.endereco}, {inquilino.numero}
                  {inquilino.complemento && `, ${inquilino.complemento}`}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Bairro</p>
                  <p className="text-base">{inquilino.bairro}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cidade</p>
                  <p className="text-base">{inquilino.cidade}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <p className="text-base">{inquilino.estado}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">País</p>
                  <p className="text-base">{inquilino.pais}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">{fiancas.length}</p>
                <p className="text-sm text-gray-600">Total de Fianças</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {fiancas.filter(f => f.status_fianca === 'aprovada' || f.status_fianca === 'ativa').length}
                </p>
                <p className="text-sm text-gray-600">Fianças Aprovadas</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-gray-600" />
                </div>
                <p className="text-lg font-bold text-gray-600">
                  {new Date(inquilino.data_cadastro).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-gray-600">Data de Cadastro</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Fianças */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Fianças do Inquilino ({fiancas.length})
            </CardTitle>
            <CardDescription>
              Todas as fianças associadas a este inquilino
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fiancas.map((fianca) => (
                <div key={fianca.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {fianca.imovel_endereco}, {fianca.imovel_numero}
                        </p>
                        <p className="text-sm text-gray-600">
                          {fianca.imovel_bairro}, {fianca.imovel_cidade}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(fianca.status_fianca)} text-white`}>
                      {getStatusLabel(fianca.status_fianca)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Valor do Aluguel</p>
                      <p className="font-medium">R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Data de Criação</p>
                      <p className="font-medium">{new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}</p>
                    </div>
                    {fianca.data_analise && (
                      <div>
                        <p className="text-gray-500">Data de Análise</p>
                        <p className="font-medium">{new Date(fianca.data_analise).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                    {fianca.score_credito && (
                      <div>
                        <p className="text-gray-500">Score de Crédito</p>
                        <p className="font-medium">{fianca.score_credito}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/detalhe-fianca/${fianca.id}`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DetalheInquilino;

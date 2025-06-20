
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle,
  Clock,
  Mail,
  Phone,
  FileText,
  DollarSign,
  Search,
  Filter,
  Calendar,
  TrendingDown
} from 'lucide-react';

interface InadimplenciaItem {
  id: string;
  inquilino: string;
  emailInquilino: string;
  telefoneInquilino: string;
  cpfInquilino: string;
  imovel: string;
  enderecoImovel: string;
  valorOriginal: number;
  valorAtualizado: number;
  diasAtraso: number;
  dataVencimento: string;
  ultimaAcao: string;
  dataUltimaAcao: string;
  gravidade: 'baixa' | 'media' | 'alta' | 'critica';
}

const InadimplenciaFinanceiro = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroGravidade, setFiltroGravidade] = useState('todos');
  
  const [inadimplentes] = useState<InadimplenciaItem[]>([
    {
      id: '1',
      inquilino: 'João Silva',
      emailInquilino: 'joao@exemplo.com',
      telefoneInquilino: '(11) 99999-1111',
      cpfInquilino: '111.222.333-44',
      imovel: 'Apartamento 101',
      enderecoImovel: 'Rua A, 123 - Centro',
      valorOriginal: 2500,
      valorAtualizado: 2650,
      diasAtraso: 15,
      dataVencimento: '2024-01-15',
      ultimaAcao: 'E-mail enviado',
      dataUltimaAcao: '2024-01-20',
      gravidade: 'media'
    },
    {
      id: '2',
      inquilino: 'Maria Santos',
      emailInquilino: 'maria@exemplo.com',
      telefoneInquilino: '(11) 88888-2222',
      cpfInquilino: '555.666.777-88',
      imovel: 'Casa Térrea',
      enderecoImovel: 'Av. B, 456 - Jardins',
      valorOriginal: 3200,
      valorAtualizado: 3456,
      diasAtraso: 45,
      dataVencimento: '2023-12-15',
      ultimaAcao: 'Contato telefônico',
      dataUltimaAcao: '2024-01-25',
      gravidade: 'alta'
    }
  ]);

  const enviarEmail = (id: string) => {
    toast({
      title: "E-mail enviado!",
      description: "Notificação de cobrança enviada ao inquilino.",
    });
  };

  const registrarContato = (id: string, tipo: string) => {
    toast({
      title: "Contato registrado!",
      description: `${tipo} registrado no histórico do inquilino.`,
    });
  };

  const iniciarProcessoJuridico = (id: string) => {
    toast({
      title: "Processo iniciado!",
      description: "Caso encaminhado para o departamento jurídico.",
    });
  };

  const getGravidadeColor = (gravidade: string) => {
    switch (gravidade) {
      case 'baixa': return 'bg-yellow-500';
      case 'media': return 'bg-orange-500';
      case 'alta': return 'bg-red-500';
      case 'critica': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  const getGravidadeText = (gravidade: string) => {
    switch (gravidade) {
      case 'baixa': return 'Baixa';
      case 'media': return 'Média';
      case 'alta': return 'Alta';
      case 'critica': return 'Crítica';
      default: return gravidade;
    }
  };

  const calcularGravidade = (diasAtraso: number): InadimplenciaItem['gravidade'] => {
    if (diasAtraso <= 7) return 'baixa';
    if (diasAtraso <= 30) return 'media';
    if (diasAtraso <= 60) return 'alta';
    return 'critica';
  };

  const filteredInadimplentes = inadimplentes.filter(item => {
    const matchesSearch = 
      item.inquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.emailInquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.imovel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGravidade = filtroGravidade === 'todos' || item.gravidade === filtroGravidade;
    
    return matchesSearch && matchesGravidade;
  });

  const estatisticas = {
    totalInadimplentes: inadimplentes.length,
    valorTotal: inadimplentes.reduce((sum, item) => sum + item.valorAtualizado, 0),
    mediaAtraso: inadimplentes.reduce((sum, item) => sum + item.diasAtraso, 0) / inadimplentes.length,
    casosCriticos: inadimplentes.filter(item => item.gravidade === 'critica').length
  };

  return (
    <Layout title="Inadimplência">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600">Gestão de Inadimplência</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar inadimplentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            <Select value={filtroGravidade} onValueChange={setFiltroGravidade}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Inadimplentes</p>
                  <p className="text-2xl font-bold text-red-600">{estatisticas.totalInadimplentes}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-red-600">R$ {estatisticas.valorTotal.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Média de Atraso</p>
                  <p className="text-2xl font-bold text-orange-600">{estatisticas.mediaAtraso.toFixed(0)} dias</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Casos Críticos</p>
                  <p className="text-2xl font-bold text-red-700">{estatisticas.casosCriticos}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Inadimplentes */}
        <div className="space-y-4">
          {filteredInadimplentes.map((item) => (
            <Card key={item.id} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.inquilino}</h4>
                      <p className="text-sm text-gray-600">{item.emailInquilino}</p>
                      <p className="text-sm text-gray-600">{item.telefoneInquilino}</p>
                      <p className="text-sm text-gray-600">CPF: {item.cpfInquilino}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900">{item.imovel}</p>
                      <p className="text-sm text-gray-600">{item.enderecoImovel}</p>
                      <p className="text-sm text-gray-600">
                        Vencimento: {new Date(item.dataVencimento).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`${getGravidadeColor(item.gravidade)} text-white`}>
                          {getGravidadeText(item.gravidade)}
                        </Badge>
                        <span className="text-sm text-red-600 font-medium">
                          {item.diasAtraso} dias atraso
                        </span>
                      </div>
                      <p className="text-lg font-bold text-red-600">
                        R$ {item.valorAtualizado.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Original: R$ {item.valorOriginal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 w-full lg:w-auto">
                    <Button
                      size="sm"
                      onClick={() => enviarEmail(item.id)}
                      className="bg-blue-500 hover:bg-blue-600 w-full lg:w-auto"
                    >
                      <Mail className="mr-1 h-4 w-4" />
                      Enviar E-mail
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => registrarContato(item.id, 'Ligação')}
                      className="w-full lg:w-auto"
                    >
                      <Phone className="mr-1 h-4 w-4" />
                      Registrar Contato
                    </Button>
                    
                    {item.gravidade === 'alta' || item.gravidade === 'critica' ? (
                      <Button
                        size="sm"
                        onClick={() => iniciarProcessoJuridico(item.id)}
                        className="bg-red-600 hover:bg-red-700 w-full lg:w-auto"
                      >
                        <FileText className="mr-1 h-4 w-4" />
                        Acionar Jurídico
                      </Button>
                    ) : null}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Última ação:</strong> {item.ultimaAcao} - {new Date(item.dataUltimaAcao).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default InadimplenciaFinanceiro;

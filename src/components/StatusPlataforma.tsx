import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStatusPlataforma } from '@/hooks/useStatusPlataforma';
import { 
  Server, 
  Monitor, 
  Shield, 
  Cloud,
  CheckCircle,
  Globe
} from 'lucide-react';

const StatusPlataforma = () => {
  const { statusPlataforma, isLoading } = useStatusPlataforma();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="mr-2 h-5 w-5 text-primary" />
            Status da Plataforma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!statusPlataforma) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="mr-2 h-5 w-5 text-primary" />
          Status da Plataforma
        </CardTitle>
        <CardDescription>
          Informações sobre versão, compatibilidade e infraestrutura
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Versão da Plataforma */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Versão Atual</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                {statusPlataforma.versao_atual}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">
              Última atualização: {new Date(statusPlataforma.data_ultima_atualizacao).toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status do Sistema</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Online
              </Badge>
            </div>
            <p className="text-xs text-gray-600">Todos os serviços operacionais</p>
          </div>
        </div>

        {/* Compatibilidade de Navegadores */}
        <div>
          <h4 className="flex items-center text-sm font-medium mb-3">
            <Monitor className="mr-2 h-4 w-4 text-primary" />
            Navegadores Compatíveis
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statusPlataforma.navegadores_compativeis?.map((nav: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">{nav.nome} {nav.versao}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Infraestrutura */}
        <div>
          <h4 className="flex items-center text-sm font-medium mb-3">
            <Cloud className="mr-2 h-4 w-4 text-primary" />
            Infraestrutura
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Docker Version</span>
              <Badge variant="outline">{statusPlataforma.infraestrutura?.docker}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Node.js</span>
              <Badge variant="outline">{statusPlataforma.infraestrutura?.nodejs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">React</span>
              <Badge variant="outline">{statusPlataforma.infraestrutura?.react}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Supabase</span>
              <Badge variant="outline">{statusPlataforma.infraestrutura?.supabase}</Badge>
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div>
          <h4 className="flex items-center text-sm font-medium mb-3">
            <Shield className="mr-2 h-4 w-4 text-primary" />
            Segurança & Conformidade
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs">SSL/TLS Certificado</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs">LGPD Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs">Backup Automático</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs">Monitoramento 24/7</span>
            </div>
          </div>
        </div>

        {/* API & Conectividade */}
        <div>
          <h4 className="flex items-center text-sm font-medium mb-3">
            <Globe className="mr-2 h-4 w-4 text-primary" />
            APIs & Integrações
          </h4>
          <div className="space-y-2">
            {statusPlataforma.apis_integracoes?.map((api: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{api.nome}</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {api.status === 'ativa' ? 'Ativa' : api.status === 'conectada' ? 'Conectada' : api.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
          <h5 className="text-sm font-medium text-amber-900 mb-2">Próximas Atualizações</h5>
          <ul className="text-xs text-amber-800 space-y-1">
            {statusPlataforma.proximas_atualizacoes?.map((atualizacao: string, index: number) => (
              <li key={index}>• {atualizacao}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusPlataforma;
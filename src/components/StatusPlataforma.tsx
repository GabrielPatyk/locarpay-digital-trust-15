import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Monitor, 
  Shield, 
  Cloud,
  CheckCircle,
  Globe
} from 'lucide-react';

const StatusPlataforma = () => {
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
                v2.1.4
              </Badge>
            </div>
            <p className="text-xs text-gray-600">Última atualização: 22/07/2025</p>
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
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs">Chrome 120+</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs">Firefox 115+</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs">Safari 16+</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs">Edge 120+</span>
            </div>
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
              <Badge variant="outline">v24.0.7</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Node.js</span>
              <Badge variant="outline">v20.11.0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">React</span>
              <Badge variant="outline">v18.3.1</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Supabase</span>
              <Badge variant="outline">Latest</Badge>
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
            <div className="flex items-center justify-between">
              <span className="text-sm">API REST</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Ativa
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">WebSocket</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Ativa
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Integração ZapSign</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Conectada
              </Badge>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="text-sm font-medium text-blue-900 mb-2">Próximas Atualizações</h5>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Novos relatórios de performance (Agosto 2025)</li>
            <li>• Interface mobile aprimorada (Setembro 2025)</li>
            <li>• Integração com mais sistemas (Outubro 2025)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusPlataforma;
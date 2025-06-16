
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Edit, Trash2, Eye } from 'lucide-react';

const CRMSettingsPage = () => {
  const funnels = [
    {
      id: '1',
      nome: 'Funil Principal',
      etapas: 5,
      leads: 12,
      status: 'ativo'
    },
    {
      id: '2',
      nome: 'Funil Imobiliárias',
      etapas: 4,
      leads: 8,
      status: 'ativo'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configurações do CRM</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <h3 className="text-lg font-medium mb-4">Gerenciar Funis</h3>
            <div className="space-y-3">
              {funnels.map((funnel) => (
                <div key={funnel.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{funnel.nome}</h4>
                    <p className="text-sm text-gray-600">
                      {funnel.etapas} etapas • {funnel.leads} leads
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{funnel.status}</Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Configurações Gerais</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Notificações por Email</h4>
                  <p className="text-sm text-gray-600">Receber notificações sobre novos leads</p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Backup de Dados</h4>
                  <p className="text-sm text-gray-600">Exportar dados do CRM</p>
                </div>
                <Button variant="outline" size="sm">
                  Exportar
                </Button>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default CRMSettingsPage;

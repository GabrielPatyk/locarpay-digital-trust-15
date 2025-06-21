
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LeadsAdmin = () => {
  const leads = [
    {
      id: '1',
      nome: 'Roberto Silva',
      email: 'roberto@email.com',
      telefone: '(11) 9999-8888',
      empresa: 'Imobiliária Nova',
      status: 'novo',
      fonte: 'Website',
      dataContato: '2024-01-15'
    },
    {
      id: '2',
      nome: 'Carla Santos',
      email: 'carla@email.com',
      telefone: '(11) 7777-6666',
      empresa: 'Imobiliária Central',
      status: 'qualificado',
      fonte: 'Indicação',
      dataContato: '2024-01-14'
    }
  ];

  return (
    <Layout title="Gestão de Leads">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-primary">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Novos</p>
                  <p className="text-2xl font-bold text-blue-500">42</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Qualificados</p>
                  <p className="text-2xl font-bold text-green-500">89</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Convertidos</p>
                  <p className="text-2xl font-bold text-primary">25</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos os Leads</CardTitle>
            <CardDescription>Gerencie todos os leads da plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.map((lead) => (
                <div key={lead.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{lead.nome}</h4>
                      <p className="text-sm text-gray-600">{lead.empresa}</p>
                    </div>
                    <Badge className={lead.status === 'novo' ? 'bg-blue-500' : 'bg-green-500'}>
                      {lead.status === 'novo' ? 'Novo' : 'Qualificado'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">E-mail</p>
                      <p className="font-medium">{lead.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium">{lead.telefone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fonte</p>
                      <p className="font-medium">{lead.fonte}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data Contato</p>
                      <p className="font-medium">{new Date(lead.dataContato).toLocaleDateString()}</p>
                    </div>
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

export default LeadsAdmin;

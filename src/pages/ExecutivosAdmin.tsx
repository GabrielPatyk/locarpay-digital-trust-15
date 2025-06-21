
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ExecutivosAdmin = () => {
  const executivos = [
    {
      id: '1',
      nome: 'Ana Costa',
      email: 'ana@locarpay.com',
      imobiliarias: 5,
      performance: 95,
      status: 'ativo'
    },
    {
      id: '2',
      nome: 'Pedro Lima',
      email: 'pedro@locarpay.com', 
      imobiliarias: 3,
      performance: 87,
      status: 'ativo'
    }
  ];

  return (
    <Layout title="Gestão de Executivos">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Executivos</p>
                  <p className="text-2xl font-bold text-primary">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-green-500">7</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Performance Média</p>
                  <p className="text-2xl font-bold text-primary">91%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Imobiliárias Total</p>
                  <p className="text-2xl font-bold text-primary">32</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos os Executivos</CardTitle>
            <CardDescription>Gerencie a equipe de executivos de conta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {executivos.map((executivo) => (
                <div key={executivo.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{executivo.nome}</h4>
                      <p className="text-sm text-gray-600">{executivo.email}</p>
                    </div>
                    <Badge className="bg-green-500">
                      {executivo.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Imobiliárias Atendidas</p>
                      <p className="font-medium">{executivo.imobiliarias}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Performance</p>
                      <p className="font-medium">{executivo.performance}%</p>
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

export default ExecutivosAdmin;


import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ImobiliariasAdmin = () => {
  const imobiliarias = [
    {
      id: '1',
      nome: 'Imobiliária Prime',
      cnpj: '12.345.678/0001-90',
      email: 'contato@prime.com',
      telefone: '(11) 9999-9999',
      contratos: 15,
      status: 'ativa'
    },
    {
      id: '2', 
      nome: 'Imobiliária Sucesso',
      cnpj: '98.765.432/0001-10',
      email: 'contato@sucesso.com',
      telefone: '(11) 8888-8888',
      contratos: 8,
      status: 'ativa'
    }
  ];

  return (
    <Layout title="Gestão de Imobiliárias">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Imobiliárias</p>
                  <p className="text-2xl font-bold text-primary">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ativas</p>
                  <p className="text-2xl font-bold text-green-500">10</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contratos Total</p>
                  <p className="text-2xl font-bold text-primary">87</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-500">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Todas as Imobiliárias</CardTitle>
                <CardDescription>Gerencie todas as imobiliárias parceiras</CardDescription>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                Nova Imobiliária
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imobiliarias.map((imobiliaria) => (
                <div key={imobiliaria.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{imobiliaria.nome}</h4>
                      <p className="text-sm text-gray-600">CNPJ: {imobiliaria.cnpj}</p>
                    </div>
                    <Badge className="bg-green-500">
                      {imobiliaria.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">E-mail</p>
                      <p className="font-medium">{imobiliaria.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium">{imobiliaria.telefone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contratos</p>
                      <p className="font-medium">{imobiliaria.contratos}</p>
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

export default ImobiliariasAdmin;

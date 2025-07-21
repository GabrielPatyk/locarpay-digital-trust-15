import React from 'react';
import { AlertTriangle, Clock, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Manutencao = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-warning/20 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mb-4">
              <Wrench className="h-8 w-8 text-warning" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              Sistema em Manutenção
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Estamos trabalhando para melhorar sua experiência
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Voltaremos em breve</span>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Manutenção programada
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Nossa equipe está realizando atualizações importantes no sistema para proporcionar uma experiência ainda melhor.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Enquanto isso, você pode:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Verificar se a manutenção foi finalizada</li>
                <li>• Entrar em contato via WhatsApp se urgente</li>
                <li>• Aguardar nosso retorno por e-mail</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleReload}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Verificar Novamente
            </Button>
            
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Em caso de urgência, entre em contato através dos nossos canais oficiais.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Manutencao;
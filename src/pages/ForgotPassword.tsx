
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Hook para redirecionar se já estiver logado
  const { isLoading: authLoading } = useAuthRedirect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email.trim()) {
      setError('Por favor, digite seu e-mail.');
      setIsLoading(false);
      return;
    }

    try {
      // Chamar Edge Function para processar redefinição
      const { data, error } = await supabase.functions.invoke('esqueci-senha-webhook', {
        body: { email: email.trim() }
      });

      if (error) {
        console.error('Erro na Edge Function:', error);
        throw new Error(error.message || 'Erro ao processar solicitação');
      }

      if (!data.success) {
        throw new Error(data.error || 'Erro ao processar solicitação');
      }

      console.log('Resposta da Edge Function:', data);

      setSuccess(true);
      toast({
        title: "Solicitação enviada!",
        description: data.webhook_status === 'success' 
          ? "E-mail de redefinição enviado com sucesso." 
          : "Processo iniciado. Aguarde as instruções.",
      });

    } catch (err: any) {
      console.error('Erro ao solicitar redefinição:', err);
      setError(err.message || 'Erro ao processar solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Se está verificando autenticação, mostrar loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC942C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/5bdbd93e-9136-4714-9c8d-216c143ab781.png')`
        }}
      ></div>
      
      {/* Dark blue overlay with 65% opacity */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: '#040433',
          opacity: 0.65
        }}
      ></div>

      <div className="relative w-full min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Forgot Password Card */}
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 overflow-hidden">
            <CardHeader className="space-y-6 pb-4">
              {/* Logo Section */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center mb-4">
                  <img 
                    src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
                    alt="LocarPay Logo" 
                    className="w-32 h-32 object-contain drop-shadow-lg"
                  />
                </div>
                <h1 className="text-2xl font-bold text-[#0C1C2E] mb-2">
                  {success ? 'Solicitação Enviada!' : 'Esqueceu sua senha?'}
                </h1>
                <p className="text-sm text-[#0C1C2E]/70">
                  {success 
                    ? 'O processo foi iniciado com sucesso'
                    : 'Digite seu e-mail para redefinir sua senha'
                  }
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {success ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0C1C2E] mb-2">Solicitação processada!</h3>
                  <p className="text-sm text-[#0C1C2E]/70">
                    O processo de redefinição de senha foi iniciado. Aguarde as instruções.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#0C1C2E] font-medium">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-[#BC942C]" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 border-[#BC942C]/30 focus:border-[#BC942C] focus:ring-[#BC942C]/20"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E] font-semibold shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar solicitação'}
                  </Button>
                </form>
              )}

              {/* Golden footer section */}
              <div className="mt-6 -mx-6 -mb-6 px-6 py-4 bg-gradient-to-r from-[#F4D573] via-[#E6C46E] to-[#BC942C] relative overflow-hidden">
                {/* Golden texture overlay */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FFD700]/20 via-transparent to-[#B8860B]/20"></div>
                  <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#DAA520]/20 via-transparent to-[#CD853F]/20"></div>
                </div>
                <div className="relative">
                  <button
                    onClick={handleBackToLogin}
                    className="flex items-center justify-center w-full text-[#0C1C2E] font-semibold text-sm hover:text-[#0C1C2E]/80 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para login
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

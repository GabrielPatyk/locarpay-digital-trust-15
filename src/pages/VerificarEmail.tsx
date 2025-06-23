
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const VerificarEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<{ email: string; name: string } | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    if (!token) {
      setError('Token de verificação não encontrado na URL.');
      setIsLoading(false);
      return;
    }

    try {
      // Chamar a função do Supabase para verificar o e-mail
      const { data, error } = await supabase.rpc('verificar_email', {
        token_input: token
      });

      if (error) {
        console.error('Erro ao verificar e-mail:', error);
        throw new Error('Erro interno do servidor');
      }

      if (data.success) {
        setSuccess(true);
        setUserInfo({
          email: data.user_email,
          name: data.user_name
        });
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      console.error('Erro na verificação:', err);
      setError('Token de verificação inválido ou expirado. Solicite um novo e-mail de verificação.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isLoading) {
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
            <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC942C] mx-auto mb-4"></div>
                <p className="text-[#0C1C2E]">Verificando e-mail...</p>
              </CardContent>
            </Card>
          </div>
        </div>
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
                  {success ? 'E-mail Verificado!' : 'Verificação de E-mail'}
                </h1>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {success ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0C1C2E] mb-2">E-mail verificado com sucesso!</h3>
                  {userInfo && (
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-[#0C1C2E]/70">
                        Olá, <strong>{userInfo.name}</strong>!
                      </p>
                      <p className="text-sm text-[#0C1C2E]/70">
                        Seu e-mail <strong>{userInfo.email}</strong> foi verificado.
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-[#0C1C2E]/70">
                    Agora você pode fazer login normalmente.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                  <p className="text-sm text-[#0C1C2E]/70">
                    Solicite um novo e-mail de verificação através da tela de login.
                  </p>
                </div>
              )}

              {/* Golden footer section */}
              <div className="mt-6 -mx-6 -mb-6 px-6 py-4 bg-gradient-to-r from-[#F4D573] via-[#E6C46E] to-[#BC942C] relative overflow-hidden">
                {/* Golden texture overlay */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FFD700]/20 via-transparent to-[#B8860B]/20"></div>
                  <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#DAA520]/20 via-transparent to-[#CD853F]/20"></div>
                </div>
                <div className="relative">
                  <Button
                    onClick={handleBackToLogin}
                    className="flex items-center justify-center w-full bg-transparent hover:bg-transparent text-[#0C1C2E] font-semibold text-sm hover:text-[#0C1C2E]/80 transition-colors border-0 shadow-none"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {success ? 'Ir para login' : 'Voltar para login'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerificarEmail;

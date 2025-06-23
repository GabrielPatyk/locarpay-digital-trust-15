
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Por favor, digite seu e-mail.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Verificar se o usuário existe na base de dados
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .select('id, email, nome')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (usuarioError && usuarioError.code !== 'PGRST116') {
        throw new Error('Erro ao verificar usuário');
      }

      if (usuario) {
        // Gerar token único
        const token = crypto.randomUUID();
        
        // Salvar token na base de dados
        const { error: tokenError } = await supabase
          .from('tokens_redefinicao_senha')
          .insert({
            usuario_id: usuario.id,
            token: token
          });

        if (tokenError) {
          throw new Error('Erro ao gerar token de redefinição');
        }

        // Enviar webhook com todos os dados necessários
        const webhookResponse = await fetch('https://webhook.lesenechal.com.br/webhook/Esqueci-A-Minha-Senha-LocarPay-Webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: usuario.email,
            token: token,
            usuario_id: usuario.id,
            link: `${window.location.origin}/redefinir-senha?token=${token}`
          }),
        });

        if (!webhookResponse.ok) {
          throw new Error('Falha ao enviar webhook');
        }
      }

      // Sempre mostrar mensagem de sucesso por segurança (não revelar se email existe)
      setSuccess(true);
      toast({
        title: "Instruções enviadas!",
        description: "Se o e-mail informado estiver cadastrado, você receberá as instruções para redefinir sua senha.",
      });

    } catch (err) {
      console.error('Erro ao processar redefinição:', err);
      setError('Erro ao enviar instruções. Tente novamente mais tarde.');
      toast({
        title: "Erro",
        description: "Erro ao enviar instruções. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

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
          {/* Recovery Card */}
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
                <h1 className="text-2xl font-bold text-[#0C1C2E] mb-2">Esqueceu sua senha?</h1>
                <p className="text-sm text-[#0C1C2E]/70">
                  Digite seu email para receber as instruções de recuperação
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#0C1C2E] font-medium">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-[#BC942C]" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
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
                    {isLoading ? 'Enviando...' : 'Enviar instruções'}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0C1C2E] mb-2">Instruções enviadas!</h3>
                  <p className="text-sm text-[#0C1C2E]/70">
                    Se o e-mail informado estiver cadastrado, você receberá as instruções para redefinir sua senha.
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
                  <button
                    onClick={handleBackToLogin}
                    className="flex items-center justify-center w-full text-[#0C1C2E] font-semibold text-sm hover:text-[#0C1C2E]/80 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para a tela de login
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

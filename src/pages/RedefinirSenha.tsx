
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';

const RedefinirSenha = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const token = searchParams.get('token');

  // Hook para redirecionar se já estiver logado - sempre chamado
  const { isLoading: authLoading } = useAuthRedirect();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Token não encontrado na URL.');
        setIsValidating(false);
        return;
      }

      try {
        // Verificar se o token existe, não foi usado e foi criado há menos de 30 minutos
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        
        const { data: tokenData, error: tokenError } = await supabase
          .from('tokens_redefinicao_senha')
          .select('usuario_id, usado, criado_em')
          .eq('token', token)
          .eq('usado', false)
          .gte('criado_em', thirtyMinutesAgo)
          .maybeSingle();

        if (tokenError) {
          console.error('Erro ao validar token:', tokenError);
          setError('Erro ao validar token.');
          setIsValidating(false);
          return;
        }

        if (!tokenData) {
          setError('Link inválido ou expirado. Solicite uma nova redefinição de senha.');
          setIsValidating(false);
          return;
        }

        setTokenValid(true);
        setUserId(tokenData.usuario_id);
      } catch (err) {
        console.error('Erro na validação:', err);
        setError('Erro ao validar token.');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!password.trim()) {
      setError('Por favor, digite a nova senha.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    // Validar força da senha
    const requirements = [
      { test: (p: string) => p.length >= 12, message: 'A senha deve ter pelo menos 12 caracteres' },
      { test: (p: string) => /[A-Z]/.test(p), message: 'A senha deve ter pelo menos 1 letra maiúscula' },
      { test: (p: string) => /[a-z]/.test(p), message: 'A senha deve ter pelo menos 1 letra minúscula' },
      { test: (p: string) => /\d/.test(p), message: 'A senha deve ter pelo menos 1 número' },
      { test: (p: string) => /[^A-Za-z0-9!]/.test(p), message: 'A senha deve ter pelo menos 1 caractere especial (exceto !)' }
    ];

    const unmetRequirement = requirements.find(req => !req.test(password));
    if (unmetRequirement) {
      setError(unmetRequirement.message);
      setIsLoading(false);
      return;
    }

    try {
      // Hash da nova senha usando a função do Supabase
      const { data: hashedPassword, error: hashError } = await supabase
        .rpc('hash_password', { password: password });

      if (hashError) {
        console.error('Erro ao gerar hash da senha:', hashError);
        throw new Error('Erro ao processar nova senha');
      }

      // Atualizar a senha do usuário
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ senha: hashedPassword })
        .eq('id', userId);

      if (updateError) {
        console.error('Erro ao atualizar senha:', updateError);
        throw new Error('Erro ao atualizar senha');
      }

      // Marcar o token como usado
      const { error: tokenUpdateError } = await supabase
        .from('tokens_redefinicao_senha')
        .update({ usado: true })
        .eq('token', token);

      if (tokenUpdateError) {
        console.error('Erro ao marcar token como usado:', tokenUpdateError);
        // Não falhar se não conseguir marcar o token, a senha já foi alterada
      }

      setSuccess(true);
      toast({
        title: "Senha redefinida!",
        description: "Sua senha foi alterada com sucesso.",
      });

    } catch (err: any) {
      console.error('Erro ao redefinir senha:', err);
      setError('Erro ao redefinir senha. Tente novamente.');
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

  // Loading state para validação do token
  if (isValidating) {
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
                <p className="text-[#0C1C2E]">Validando token...</p>
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
          {/* Reset Password Card */}
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
                  {success ? 'Senha Redefinida!' : 'Redefinir Senha'}
                </h1>
                <p className="text-sm text-[#0C1C2E]/70">
                  {success 
                    ? 'Sua senha foi alterada com sucesso'
                    : tokenValid 
                      ? 'Digite sua nova senha'
                      : 'Link inválido ou expirado'
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
                  <h3 className="text-lg font-semibold text-[#0C1C2E] mb-2">Senha redefinida com sucesso!</h3>
                  <p className="text-sm text-[#0C1C2E]/70">
                    Você já pode fazer login com sua nova senha.
                  </p>
                </div>
              ) : tokenValid ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#0C1C2E] font-medium">Nova Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-[#BC942C]" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Digite sua nova senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 border-[#BC942C]/30 focus:border-[#BC942C] focus:ring-[#BC942C]/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#0C1C2E] font-medium">Confirmar Nova Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-[#BC942C]" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirme sua nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 border-[#BC942C]/30 focus:border-[#BC942C] focus:ring-[#BC942C]/20"
                        required
                      />
                    </div>
                  </div>

                  {password && (
                    <PasswordStrengthIndicator password={password} />
                  )}

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
                    {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                  <p className="text-sm text-[#0C1C2E]/70">
                    Solicite uma nova redefinição de senha clicando no botão abaixo.
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
                    {success ? 'Ir para login' : 'Voltar para login'}
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

export default RedefinirSenha;

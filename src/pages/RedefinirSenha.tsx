
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [tokenData, setTokenData] = useState<any>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    if (!token) {
      setError('Token não fornecido na URL.');
      setIsValidating(false);
      return;
    }

    try {
      setIsValidating(true);
      
      // Verificar se o token existe, não foi usado e está dentro do prazo de 30 minutos
      const { data, error: tokenError } = await supabase
        .from('tokens_redefinicao_senha')
        .select(`
          id,
          usuario_id,
          usado,
          criado_em,
          usuarios!inner(email, nome)
        `)
        .eq('token', token)
        .eq('usado', false)
        .single();

      if (tokenError) {
        setError('Token inválido ou expirado. Solicite uma nova redefinição de senha.');
        setTokenValid(false);
        setIsValidating(false);
        return;
      }

      // Verificar se o token foi criado há menos de 30 minutos
      const criadoEm = new Date(data.criado_em);
      const agora = new Date();
      const diferencaMinutos = (agora.getTime() - criadoEm.getTime()) / (1000 * 60);

      if (diferencaMinutos > 30) {
        setError('Link expirado. O link de redefinição é válido por apenas 30 minutos. Solicite uma nova redefinição de senha.');
        setTokenValid(false);
        setIsValidating(false);
        return;
      }

      setTokenData(data);
      setTokenValid(true);
    } catch (err) {
      console.error('Erro ao validar token:', err);
      setError('Erro ao validar token. Tente novamente mais tarde.');
      setTokenValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Por favor, digite a nova senha.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Hash da nova senha
      const { data: hashedPassword, error: hashError } = await supabase.rpc(
        'hash_password',
        { password: password }
      );

      if (hashError) {
        throw new Error('Erro ao processar nova senha');
      }

      // Atualizar a senha do usuário
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ senha: hashedPassword })
        .eq('id', tokenData.usuario_id);

      if (updateError) {
        throw new Error('Erro ao atualizar senha');
      }

      // Marcar o token como usado
      const { error: tokenUpdateError } = await supabase
        .from('tokens_redefinicao_senha')
        .update({ usado: true })
        .eq('id', tokenData.id);

      if (tokenUpdateError) {
        console.error('Erro ao marcar token como usado:', tokenUpdateError);
        // Não falhar aqui, pois a senha já foi atualizada
      }

      setSuccess(true);
      toast({
        title: "Senha redefinida com sucesso!",
        description: "Sua senha foi alterada. Você já pode fazer login com a nova senha.",
      });

    } catch (err) {
      console.error('Erro ao redefinir senha:', err);
      setError('Erro ao redefinir senha. Tente novamente mais tarde.');
      toast({
        title: "Erro",
        description: "Erro ao redefinir senha. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

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
        
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: '#040433',
            opacity: 0.65
          }}
        ></div>

        <div className="relative w-full min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BC942C] mx-auto mb-4"></div>
                <p className="text-[#0C1C2E]">Validando link de redefinição...</p>
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
              <div className="text-center">
                <div className="inline-flex items-center justify-center mb-4">
                  <img 
                    src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
                    alt="LocarPay Logo" 
                    className="w-32 h-32 object-contain drop-shadow-lg"
                  />
                </div>
                <h1 className="text-2xl font-bold text-[#0C1C2E] mb-2">
                  {tokenValid ? 'Redefinir Senha' : 'Link Inválido'}
                </h1>
                {tokenValid && (
                  <p className="text-sm text-[#0C1C2E]/70">
                    Digite sua nova senha abaixo
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!tokenValid ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0C1C2E] mb-2">Link Inválido</h3>
                  <p className="text-sm text-[#0C1C2E]/70 mb-4">
                    {error}
                  </p>
                </div>
              ) : success ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0C1C2E] mb-2">Senha redefinida com sucesso!</h3>
                  <p className="text-sm text-[#0C1C2E]/70">
                    Sua senha foi alterada. Você já pode fazer login com a nova senha.
                  </p>
                </div>
              ) : (
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
                        minLength={6}
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
                        minLength={6}
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
                    {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                  </Button>
                </form>
              )}

              {/* Golden footer section */}
              <div className="mt-6 -mx-6 -mb-6 px-6 py-4 bg-gradient-to-r from-[#F4D573] via-[#E6C46E] to-[#BC942C] relative overflow-hidden">
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

export default RedefinirSenha;

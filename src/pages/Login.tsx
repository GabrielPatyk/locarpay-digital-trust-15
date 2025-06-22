
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
        });
        navigate(result.redirectPath || '/dashboard');
      } else {
        setError('Credenciais inválidas. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handlePartnerRegistration = () => {
    window.open('https://locarpay.com.br/seja-um-parceiro', '_blank');
  };

  const demoUsers = [
    { type: 'Analista', email: 'analista@locarpay.com' },
    { type: 'Jurídico', email: 'juridico@locarpay.com' },
    { type: 'SDR', email: 'sdr@locarpay.com' },
    { type: 'Executivo', email: 'executivo@locarpay.com' },
    { type: 'Imobiliária', email: 'imobiliaria@exemplo.com' },
    { type: 'Inquilino', email: 'inquilino@exemplo.com' },
    { type: 'Financeiro', email: 'financeiro@locarpay.com' },
    { type: 'Admin', email: 'admin@locarpay.com' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/5bdbd93e-9136-4714-9c8d-216c143ab781.png')`
        }}
      ></div>
      
      {/* Dark blue overlay with 65% opacity */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#040433',
          opacity: 0.65
        }}
      ></div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 overflow-hidden">
            <CardHeader className="space-y-6 pb-4">
              {/* Logo Section - moved inside the card */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center mb-4">
                  <img 
                    src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
                    alt="LocarPay Logo" 
                    className="w-32 h-32 object-contain drop-shadow-lg"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#0C1C2E] font-medium">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-[#BC942C]" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 border-[#BC942C]/30 focus:border-[#BC942C] focus:ring-[#BC942C]/20"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-[#BC942C]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#BC942C]" />
                      )}
                    </Button>
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
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>

              <div className="text-center">
                <Button 
                  variant="link" 
                  className="text-sm text-[#BC942C] hover:text-[#B48534]"
                  onClick={handleForgotPassword}
                >
                  Esqueceu sua senha?
                </Button>
              </div>

              <div className="pt-4 border-t border-[#BC942C]/20">
                <p className="text-sm text-[#0C1C2E] mb-3 text-center font-medium">
                  <strong>Contas de demonstração (senha: 123456):</strong>
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {demoUsers.map((user, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setEmail(user.email)}
                      className="text-left p-2 rounded-lg bg-gradient-to-r from-[#F4D573]/20 to-[#E6C46E]/20 hover:from-[#F4D573]/30 hover:to-[#E6C46E]/30 transition-all duration-200 border border-[#BC942C]/20"
                    >
                      <div className="font-medium text-[#0C1C2E]">{user.type}</div>
                      <div className="text-[#0C1C2E]/70 truncate text-xs">{user.email}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Golden section at the bottom */}
              <div className="mt-6 -mx-6 -mb-6 px-6 py-4 bg-gradient-to-r from-[#F4D573] via-[#E6C46E] to-[#BC942C] relative overflow-hidden">
                {/* Golden texture overlay */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FFD700]/20 via-transparent to-[#B8860B]/20"></div>
                  <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#DAA520]/20 via-transparent to-[#CD853F]/20"></div>
                </div>
                <div className="relative text-center">
                  <p className="text-[#0C1C2E] font-semibold text-sm">
                    Quer se tornar parceiro? 
                    <br />
                    <span 
                      className="underline cursor-pointer hover:text-[#0C1C2E]/80 transition-colors"
                      onClick={handlePartnerRegistration}
                    >
                      Cadastre-se aqui!
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;

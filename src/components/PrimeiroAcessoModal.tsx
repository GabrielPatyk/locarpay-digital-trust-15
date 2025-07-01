import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { usePrimeiroAcesso } from '@/hooks/usePrimeiroAcesso';

interface PrimeiroAcessoModalProps {
  open: boolean;
}

const PrimeiroAcessoModal: React.FC<PrimeiroAcessoModalProps> = ({ open }) => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { disparaWebhookPrimeiroAcesso, marcarPrimeiroAcessoConcluido } = usePrimeiroAcesso();

  const handleRedefinirSenha = async () => {
    if (!novaSenha || !confirmarSenha) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    if (novaSenha.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Disparar webhook e gerar token
      await disparaWebhookPrimeiroAcesso();

      // Hash da nova senha
      const { data: hashedPassword, error: hashError } = await supabase.rpc(
        'hash_password',
        { password: novaSenha }
      );

      if (hashError) {
        throw new Error('Erro ao processar nova senha');
      }

      // Atualizar senha no banco
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ senha: hashedPassword })
        .eq('email', (await supabase.auth.getUser()).data.user?.email);

      if (updateError) {
        throw new Error('Erro ao atualizar senha');
      }

      // Marcar primeiro acesso como concluído
      await marcarPrimeiroAcessoConcluido();

      toast({
        title: "Senha redefinida com sucesso!",
        description: "Sua senha foi alterada e o sistema foi notificado."
      });

      // Opcional: fazer logout forçado para novo login
      // await supabase.auth.signOut();
      
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      toast({
        title: "Erro ao redefinir senha",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Primeiro Acesso - Redefinição Obrigatória
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Bem-vindo!</strong> Por segurança, é necessário redefinir sua senha no primeiro acesso.
              Sua senha atual é o número do seu CNPJ.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nova-senha">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="nova-senha"
                  type={showPassword ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite sua nova senha"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirmar-senha"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleRedefinirSenha}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Lock className="mr-2 h-4 w-4 animate-spin" />
                Redefinindo...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Redefinir Senha
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrimeiroAcessoModal;
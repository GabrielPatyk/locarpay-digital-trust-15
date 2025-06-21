
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const PWAInstallButton = () => {
  const { isAuthenticated } = useAuth();
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();
  const { toast } = useToast();

  // Only show for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  // Don't show if already installed
  if (isInstalled) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        disabled
        className="text-green-600 border-green-600"
      >
        <Check className="w-4 h-4 mr-2" />
        App Instalado
      </Button>
    );
  }

  // Don't show if not installable
  if (!isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installPWA();
    
    if (success) {
      toast({
        title: "App instalado com sucesso!",
        description: "O LocarPay foi adicionado à sua tela inicial.",
      });
    } else {
      toast({
        title: "Instalação cancelada",
        description: "Você pode instalar o app a qualquer momento.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={handleInstall}
      size="sm"
      className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E]"
    >
      <Download className="w-4 h-4 mr-2" />
      Instalar App
    </Button>
  );
};

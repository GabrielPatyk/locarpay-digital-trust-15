
import { useToast } from '@/hooks/use-toast';

export const useFormFormatters = () => {
  const { toast } = useToast();

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 11);
    
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
    } else if (limitedNumbers.length <= 9) {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9)}`;
    }
  };

  const isValidCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
      return false;
    }

    let sum = 0;
    let remainder;

    // Validação do primeiro dígito
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanCPF[i - 1]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cleanCPF[9])) {
      return false;
    }

    // Validação do segundo dígito
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanCPF[i - 1]) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cleanCPF[10])) {
      return false;
    }

    return true;
  };

  const validateCPF = (cpf: string, onError: () => void): boolean => {
    if (!isValidCPF(cpf)) {
      toast({
        title: "CPF Inválido",
        description: "Por favor, insira um CPF válido.",
        variant: "destructive",
      });
      onError();
      return false;
    }
    return true;
  };

  const formatWhatsApp = (value: string): string => {
    let numbers = value.replace(/\D/g, '');
    
    // Always start with 55
    if (!numbers.startsWith('55')) {
      numbers = '55' + numbers.replace(/^55/, '');
    }
    
    // Limit to 13 digits
    numbers = numbers.slice(0, 13);
    
    // Apply mask +55 (XX) X XXXX-XXXX
    if (numbers.length <= 2) {
      return `+${numbers}`;
    } else if (numbers.length <= 4) {
      return `+${numbers.slice(0, 2)} (${numbers.slice(2)}`;
    } else if (numbers.length <= 5) {
      return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4)}`;
    } else if (numbers.length <= 9) {
      return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 5)} ${numbers.slice(5)}`;
    } else {
      return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 5)} ${numbers.slice(5, 9)}-${numbers.slice(9)}`;
    }
  };

  const formatCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseInt(numbers) / 100;
    
    if (isNaN(amount)) return 'R$ 0,00';
    
    return `R$ ${amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 8);
    
    if (limitedNumbers.length <= 5) {
      return limitedNumbers;
    } else {
      return `${limitedNumbers.slice(0, 5)}-${limitedNumbers.slice(5)}`;
    }
  };

  const fetchAddressByCEP = async (cep: string, onSuccess: (address: any) => void): Promise<void> => {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
      toast({
        title: "CEP Inválido",
        description: "Por favor, insira um CEP válido com 8 dígitos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "O CEP informado não foi encontrado.",
          variant: "destructive",
        });
        return;
      }
      
      onSuccess({
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || ''
      });
      
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar o CEP. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const parseCurrencyToNumber = (value: string): number => {
    const cleanValue = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };

  return {
    formatCPF,
    validateCPF,
    formatWhatsApp,
    formatCurrency,
    formatCEP,
    fetchAddressByCEP,
    parseCurrencyToNumber
  };
};

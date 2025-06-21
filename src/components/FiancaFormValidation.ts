
import { FiancaData } from '@/hooks/useFiancas';

export const validateFiancaForm = (formData: FiancaData): string[] => {
  const errors: string[] = [];

  // Validação dos dados do inquilino
  if (!formData.nomeCompleto.trim()) errors.push('Nome completo é obrigatório');
  if (!formData.cpf.trim()) errors.push('CPF é obrigatório');
  if (!formData.email.trim()) errors.push('E-mail é obrigatório');
  if (!formData.whatsapp.trim()) errors.push('WhatsApp é obrigatório');
  if (!formData.rendaMensal.trim()) errors.push('Renda mensal é obrigatória');

  // Validação do endereço do inquilino
  if (!formData.inquilinoEndereco.trim()) errors.push('Endereço do inquilino é obrigatório');
  if (!formData.inquilinoNumero.trim()) errors.push('Número do endereço do inquilino é obrigatório');
  if (!formData.inquilinoBairro.trim()) errors.push('Bairro do inquilino é obrigatório');
  if (!formData.inquilinoCidade.trim()) errors.push('Cidade do inquilino é obrigatória');
  if (!formData.inquilinoEstado.trim()) errors.push('Estado do inquilino é obrigatório');

  // Validação dos dados do imóvel
  if (!formData.tipoImovel.trim()) errors.push('Tipo de imóvel é obrigatório');
  if (!formData.tipoLocacao.trim()) errors.push('Tipo de locação é obrigatório');
  if (!formData.valorAluguel.trim()) errors.push('Valor do aluguel é obrigatório');
  if (!formData.tempoLocacao.trim()) errors.push('Tempo de locação é obrigatório');

  // Validação do endereço do imóvel
  if (!formData.imovelEndereco.trim()) errors.push('Endereço do imóvel é obrigatório');
  if (!formData.imovelNumero.trim()) errors.push('Número do endereço do imóvel é obrigatório');
  if (!formData.imovelBairro.trim()) errors.push('Bairro do imóvel é obrigatório');
  if (!formData.imovelCidade.trim()) errors.push('Cidade do imóvel é obrigatória');
  if (!formData.imovelEstado.trim()) errors.push('Estado do imóvel é obrigatório');

  return errors;
};

export const formatCurrency = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  const amount = parseFloat(numbers) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return value;
};

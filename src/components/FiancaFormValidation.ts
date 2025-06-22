
import type { FiancaFormData } from '@/hooks/useFiancas';

export const validateFiancaForm = (formData: FiancaFormData): string[] => {
  const errors: string[] = [];

  // Validar dados do inquilino
  if (!formData.nomeCompleto.trim()) errors.push('Nome completo é obrigatório');
  if (!formData.cpf.trim()) errors.push('CPF é obrigatório');
  if (!formData.email.trim()) errors.push('E-mail é obrigatório');
  if (!formData.whatsapp.trim() || formData.whatsapp === '+55') errors.push('WhatsApp é obrigatório');
  if (!formData.rendaMensal.trim()) errors.push('Renda mensal é obrigatória');

  // Validar endereço do inquilino
  if (!formData.inquilinoEndereco.trim()) errors.push('Endereço do inquilino é obrigatório');
  if (!formData.inquilinoNumero.trim()) errors.push('Número do endereço do inquilino é obrigatório');
  if (!formData.inquilinoBairro.trim()) errors.push('Bairro do inquilino é obrigatório');
  if (!formData.inquilinoCidade.trim()) errors.push('Cidade do inquilino é obrigatória');
  if (!formData.inquilinoEstado.trim()) errors.push('Estado do inquilino é obrigatório');

  // Validar dados do imóvel
  if (!formData.tipoImovel.trim()) errors.push('Tipo de imóvel é obrigatório');
  if (!formData.tipoLocacao.trim()) errors.push('Tipo de locação é obrigatório');
  if (!formData.valorAluguel.trim()) errors.push('Valor do aluguel é obrigatório');
  if (!formData.tempoLocacao.trim()) errors.push('Tempo de locação é obrigatório');

  // Validar endereço do imóvel
  if (!formData.imovelEndereco.trim()) errors.push('Endereço do imóvel é obrigatório');
  if (!formData.imovelNumero.trim()) errors.push('Número do endereço do imóvel é obrigatório');
  if (!formData.imovelBairro.trim()) errors.push('Bairro do imóvel é obrigatório');
  if (!formData.imovelCidade.trim()) errors.push('Cidade do imóvel é obrigatória');
  if (!formData.imovelEstado.trim()) errors.push('Estado do imóvel é obrigatório');

  // Validar formato do e-mail
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push('E-mail deve ter um formato válido');
  }

  return errors;
};

export const formatCurrency = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  const formatted = (parseInt(numbers) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  return formatted;
};

export const parseCurrencyToNumber = (value: string): number => {
  return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
};

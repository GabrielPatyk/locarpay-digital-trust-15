
import { useState } from 'react';

export const useCurrencyFormatter = () => {
  const formatCurrency = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Se não tem números, retorna vazio
    if (!numbers) return '';
    
    // Converte para número dividindo por 100 para ter os centavos
    const numberValue = parseInt(numbers) / 100;
    
    // Formata como moeda brasileira
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const unformatCurrency = (value: string): number => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const cleanValue = value.replace(/[^\d,]/g, '');
    
    // Substitui vírgula por ponto
    const normalizedValue = cleanValue.replace(',', '.');
    
    // Converte para número
    return parseFloat(normalizedValue) || 0;
  };

  return {
    formatCurrency,
    unformatCurrency
  };
};

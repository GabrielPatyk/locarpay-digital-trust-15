
import { useState } from 'react';

export const usePhoneFormatter = () => {
  const formatPhone = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Sempre força começar com 55
    let formattedNumbers = numbers;
    if (!numbers.startsWith('55')) {
      formattedNumbers = '55' + numbers.replace(/^55/, '');
    }
    
    // Limita a 13 dígitos
    formattedNumbers = formattedNumbers.slice(0, 13);
    
    // Aplica a máscara +55 (XX) X XXXX-XXXX
    if (formattedNumbers.length <= 2) {
      return `+${formattedNumbers}`;
    } else if (formattedNumbers.length <= 4) {
      return `+${formattedNumbers.slice(0, 2)} (${formattedNumbers.slice(2)}`;
    } else if (formattedNumbers.length <= 5) {
      return `+${formattedNumbers.slice(0, 2)} (${formattedNumbers.slice(2, 4)}) ${formattedNumbers.slice(4)}`;
    } else if (formattedNumbers.length <= 9) {
      return `+${formattedNumbers.slice(0, 2)} (${formattedNumbers.slice(2, 4)}) ${formattedNumbers.slice(4, 5)} ${formattedNumbers.slice(5)}`;
    } else {
      return `+${formattedNumbers.slice(0, 2)} (${formattedNumbers.slice(2, 4)}) ${formattedNumbers.slice(4, 5)} ${formattedNumbers.slice(5, 9)}-${formattedNumbers.slice(9)}`;
    }
  };

  const formatCNPJ = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 14 dígitos
    const limitedNumbers = numbers.slice(0, 14);
    
    // Aplica a máscara XX.XXX.XXX/XXXX-XX
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 5) {
      return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2)}`;
    } else if (limitedNumbers.length <= 8) {
      return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5)}`;
    } else if (limitedNumbers.length <= 12) {
      return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8)}`;
    } else {
      return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8, 12)}-${limitedNumbers.slice(12)}`;
    }
  };

  const unformatPhone = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  const unformatCNPJ = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  const isValidPhone = (value: string): boolean => {
    const numbers = value.replace(/\D/g, '');
    return numbers.length === 13 && numbers.startsWith('55');
  };

  return {
    formatPhone,
    formatCNPJ,
    unformatPhone,
    unformatCNPJ,
    isValidPhone
  };
};

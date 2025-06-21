
import { useState } from 'react';

export const usePhoneFormatter = (initialValue: string = '') => {
  const [formattedValue, setFormattedValue] = useState(formatPhone(initialValue));

  const formatPhone = (value: string): string => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 13 dígitos
    const limitedNumbers = numbers.slice(0, 13);
    
    // Aplica a formatação +55 (xx) x xxxx-xxxx
    if (limitedNumbers.length <= 2) {
      return `+${limitedNumbers}`;
    } else if (limitedNumbers.length <= 4) {
      return `+${limitedNumbers.slice(0, 2)} (${limitedNumbers.slice(2)})`;
    } else if (limitedNumbers.length <= 5) {
      return `+${limitedNumbers.slice(0, 2)} (${limitedNumbers.slice(2, 4)}) ${limitedNumbers.slice(4)}`;
    } else if (limitedNumbers.length <= 9) {
      return `+${limitedNumbers.slice(0, 2)} (${limitedNumbers.slice(2, 4)}) ${limitedNumbers.slice(4, 5)} ${limitedNumbers.slice(5)}`;
    } else {
      return `+${limitedNumbers.slice(0, 2)} (${limitedNumbers.slice(2, 4)}) ${limitedNumbers.slice(4, 5)} ${limitedNumbers.slice(5, 9)}-${limitedNumbers.slice(9)}`;
    }
  };

  const handleChange = (value: string) => {
    const formatted = formatPhone(value);
    setFormattedValue(formatted);
  };

  const getUnformattedValue = (): string => {
    return formattedValue.replace(/\D/g, '');
  };

  const isValid = (): boolean => {
    const numbers = getUnformattedValue();
    return numbers.length === 13 && numbers.startsWith('55');
  };

  return {
    formattedValue,
    handleChange,
    getUnformattedValue,
    isValid,
    setFormattedValue
  };
};

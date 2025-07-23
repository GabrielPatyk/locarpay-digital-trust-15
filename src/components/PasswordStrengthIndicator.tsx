import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthProps {
  password: string;
}

interface PasswordRequirement {
  test: (password: string) => boolean;
  label: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({ password }) => {
  const requirements: PasswordRequirement[] = [
    { test: (p) => p.length >= 12, label: 'Pelo menos 12 caracteres' },
    { test: (p) => /[A-Z]/.test(p), label: 'Pelo menos 1 letra maiúscula' },
    { test: (p) => /[a-z]/.test(p), label: 'Pelo menos 1 letra minúscula' },
    { test: (p) => /\d/.test(p), label: 'Pelo menos 1 número' },
    { test: (p) => /[^A-Za-z0-9!]/.test(p), label: 'Pelo menos 1 caractere especial (exceto !)' }
  ];

  const metRequirements = requirements.filter(req => req.test(password));
  const strengthPercentage = (metRequirements.length / requirements.length) * 100;

  const getStrengthText = () => {
    if (strengthPercentage === 0) return 'Muito Fraca';
    if (strengthPercentage <= 25) return 'Fraca';
    if (strengthPercentage <= 50) return 'Média';
    if (strengthPercentage <= 75) return 'Forte';
    return 'Extra Forte';
  };

  const getStrengthColor = () => {
    if (strengthPercentage <= 25) return 'bg-red-500';
    if (strengthPercentage <= 50) return 'bg-yellow-500';
    if (strengthPercentage <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const isPasswordValid = () => {
    return requirements.every(req => req.test(password));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Força da senha:</span>
          <span className={`text-sm font-semibold ${
            strengthPercentage <= 25 ? 'text-red-600' :
            strengthPercentage <= 50 ? 'text-yellow-600' :
            strengthPercentage <= 75 ? 'text-blue-600' :
            'text-green-600'
          }`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-700">Requisitos:</p>
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              req.test(password) ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <span className={`text-xs ${
              req.test(password) ? 'text-green-700' : 'text-gray-600'
            }`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
      
      {password && !isPasswordValid() && (
        <p className="text-xs text-red-600 font-medium">
          A senha deve atender a todos os requisitos acima.
        </p>
      )}
    </div>
  );
};

export { PasswordStrengthIndicator };
export type { PasswordStrengthProps };
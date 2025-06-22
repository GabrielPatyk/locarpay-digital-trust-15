
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registrar Nova Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Em desenvolvimento
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Button
            onClick={() => navigate('/login')}
            className="w-full"
          >
            Voltar para Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;

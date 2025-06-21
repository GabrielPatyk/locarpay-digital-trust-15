
export type UserType = 
  | 'analista'
  | 'juridico'
  | 'sdr'
  | 'executivo'
  | 'imobiliaria'
  | 'inquilino'
  | 'financeiro'
  | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
  avatar?: string;
  imobiliariaId?: string;
  executivoId?: string;
  firstLogin?: boolean;
  contractAccepted?: boolean;
  companyName?: string;
  cnpj?: string;
  address?: string;
  fullName?: string;
  telefone?: string;
  ativo?: boolean;
  verificado?: boolean; // Novo campo para verificação de e-mail
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

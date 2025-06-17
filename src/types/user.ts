
export type UserType = 
  | 'analista'
  | 'juridico'
  | 'sdr'
  | 'executivo'
  | 'imobiliaria'
  | 'inquilino'
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
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

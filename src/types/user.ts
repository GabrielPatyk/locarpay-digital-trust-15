
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
  cpf?: string;
  address?: string;
  fullName?: string;
  telefone?: string;
  ativo?: boolean;
  verificado?: boolean;
  imagem_perfil?: string;
  criado_por?: string;
}

export interface UserProfile {
  id: string;
  usuario_id: string;
  nome_empresa?: string;
  cnpj?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

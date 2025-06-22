
-- Criar tabela usuarios
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  nome TEXT NOT NULL,
  telefone TEXT,
  cargo TEXT NOT NULL CHECK (cargo IN ('admin', 'analista', 'corretor', 'juridico', 'sdr', 'executivo', 'imobiliaria', 'inquilino', 'financeiro')),
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seus próprios dados
CREATE POLICY "Usuarios podem ver seus próprios dados"
  ON public.usuarios
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Política para admins verem todos os usuários
CREATE POLICY "Admins podem ver todos os usuarios"
  ON public.usuarios
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id::text = auth.uid()::text AND cargo = 'admin'
    )
  );

-- Função para validar login
CREATE OR REPLACE FUNCTION public.validar_login(
  email_input TEXT,
  senha_input TEXT
)
RETURNS TABLE(
  id UUID,
  email TEXT,
  nome TEXT,
  telefone TEXT,
  cargo TEXT,
  ativo BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.nome,
    u.telefone,
    u.cargo,
    u.ativo
  FROM public.usuarios u
  WHERE u.email = email_input 
    AND u.senha = senha_input
    AND u.ativo = true;
END;
$$;

-- Inserir usuários de demonstração
INSERT INTO public.usuarios (email, senha, nome, telefone, cargo) VALUES
('admin@locarpay.com', '123456', 'Administrador do Sistema', '(11) 99999-8888', 'admin'),
('analista@locarpay.com', '123456', 'Ana Costa Oliveira', '(11) 99999-3333', 'analista'),
('juridico@locarpay.com', '123456', 'Carlos Mendes Santos', '(11) 99999-4444', 'juridico'),
('sdr@locarpay.com', '123456', 'Maria Santos Lima', '(11) 99999-5555', 'sdr'),
('executivo@locarpay.com', '123456', 'Pedro Lima Costa', '(11) 99999-6666', 'executivo'),
('imobiliaria@exemplo.com', '123456', 'Roberto Silva - Imobiliária Prime Ltda', '(11) 99999-2222', 'imobiliaria'),
('inquilino@exemplo.com', '123456', 'João Silva dos Santos', '(11) 99999-1111', 'inquilino'),
('financeiro@locarpay.com', '123456', 'Lucas Oliveira Santos', '(11) 99999-7777', 'financeiro');

-- Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION public.atualizar_timestamp_usuarios()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_timestamp_usuarios
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_timestamp_usuarios();

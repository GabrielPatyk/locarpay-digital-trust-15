
-- Adicionar campo para imagem de perfil na tabela usuarios
ALTER TABLE public.usuarios 
ADD COLUMN imagem_perfil TEXT;

-- Adicionar campo para rastrear quem criou o usuário
ALTER TABLE public.usuarios 
ADD COLUMN criado_por UUID REFERENCES public.usuarios(id);

-- Criar tabela perfil_usuario para dados adicionais
CREATE TABLE public.perfil_usuario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nome_empresa TEXT,
  cnpj TEXT,
  endereco_completo TEXT,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Garantir que cada usuário tenha apenas um perfil
  UNIQUE(usuario_id)
);

-- Adicionar RLS para a nova tabela
ALTER TABLE public.perfil_usuario ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam e editem apenas seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil" 
  ON public.perfil_usuario 
  FOR SELECT 
  USING (usuario_id IN (
    SELECT id FROM public.usuarios WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  ));

CREATE POLICY "Usuários podem criar seu próprio perfil" 
  ON public.perfil_usuario 
  FOR INSERT 
  WITH CHECK (usuario_id IN (
    SELECT id FROM public.usuarios WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  ));

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
  ON public.perfil_usuario 
  FOR UPDATE 
  USING (usuario_id IN (
    SELECT id FROM public.usuarios WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  ));

-- Trigger para atualizar o timestamp automaticamente
CREATE OR REPLACE FUNCTION atualizar_timestamp_perfil_usuario()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_timestamp_perfil_usuario
  BEFORE UPDATE ON public.perfil_usuario
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp_perfil_usuario();

-- Função para criar perfil automaticamente quando necessário
CREATE OR REPLACE FUNCTION criar_perfil_usuario_se_necessario(p_usuario_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  perfil_id UUID;
BEGIN
  -- Verificar se já existe um perfil
  SELECT id INTO perfil_id 
  FROM public.perfil_usuario 
  WHERE usuario_id = p_usuario_id;
  
  -- Se não existe, criar um novo
  IF perfil_id IS NULL THEN
    INSERT INTO public.perfil_usuario (usuario_id)
    VALUES (p_usuario_id)
    RETURNING id INTO perfil_id;
  END IF;
  
  RETURN perfil_id;
END;
$$;


-- Add the inquilino_usuario_id column to link fiancas to existing user accounts
ALTER TABLE public.fiancas_locaticias 
ADD COLUMN inquilino_usuario_id UUID REFERENCES public.usuarios(id);

-- Add CPF column to usuarios table for tenant identification
ALTER TABLE public.usuarios 
ADD COLUMN cpf TEXT;

-- Create index for better performance on CPF lookups
CREATE INDEX idx_usuarios_cpf ON public.usuarios(cpf);

-- Create index for better performance on inquilino_usuario_id lookups
CREATE INDEX idx_fiancas_inquilino_usuario_id ON public.fiancas_locaticias(inquilino_usuario_id);

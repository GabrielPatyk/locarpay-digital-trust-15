
-- Criar tabela de contratos LocarPay
CREATE TABLE public.contratos_locarpay (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  imobiliaria_id UUID NOT NULL REFERENCES public.usuarios(id),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'assinado')),
  link_assinatura TEXT,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela
ALTER TABLE public.contratos_locarpay ENABLE ROW LEVEL SECURITY;

-- Política para imobiliárias verem seus próprios contratos
CREATE POLICY "Imobiliarias podem ver seus contratos"
ON public.contratos_locarpay
FOR SELECT
USING (imobiliaria_id = get_current_user_id());

-- Política para imobiliárias inserirem seus próprios contratos
CREATE POLICY "Imobiliarias podem inserir seus contratos"
ON public.contratos_locarpay
FOR INSERT
WITH CHECK (imobiliaria_id = get_current_user_id());

-- Política para imobiliárias atualizarem seus próprios contratos
CREATE POLICY "Imobiliarias podem atualizar seus contratos"
ON public.contratos_locarpay
FOR UPDATE
USING (imobiliaria_id = get_current_user_id());

-- Políticas para admins verem e gerenciarem todos os contratos
CREATE POLICY "Admins podem ver todos os contratos"
ON public.contratos_locarpay
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.usuarios 
  WHERE id = get_current_user_id() 
  AND cargo = 'admin'
));

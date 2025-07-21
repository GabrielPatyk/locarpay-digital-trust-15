-- Adicionar campo financeiro_id para identificar qual financeiro analisou a fiança
ALTER TABLE public.fiancas_locaticias 
ADD COLUMN financeiro_id uuid REFERENCES public.usuarios(id);

-- Criar índice para melhor performance
CREATE INDEX idx_fiancas_locaticias_financeiro_id ON public.fiancas_locaticias(financeiro_id);

-- Atualizar a política de RLS para financeiros verem apenas suas fianças
DROP POLICY IF EXISTS "Usuarios podem ver suas proprias fiancas" ON public.fiancas_locaticias;

-- Nova política para financeiros verem apenas fianças que analisaram
CREATE POLICY "Financeiros podem ver suas fiancas analisadas" 
ON public.fiancas_locaticias 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE usuarios.id = auth.uid() 
    AND usuarios.cargo = 'financeiro'
    AND fiancas_locaticias.financeiro_id = usuarios.id
  )
);

-- Permitir financeiros atualizarem fianças que estão analisando
CREATE POLICY "Financeiros podem atualizar fiancas em analise" 
ON public.fiancas_locaticias 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE usuarios.id = auth.uid() 
    AND usuarios.cargo = 'financeiro'
    AND (
      fiancas_locaticias.status_fianca = 'enviada_ao_financeiro' 
      OR fiancas_locaticias.financeiro_id = usuarios.id
    )
  )
);
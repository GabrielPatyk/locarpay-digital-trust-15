-- Adicionar campo motivo_manutencao na tabela configuracoes_sistema
ALTER TABLE public.configuracoes_sistema 
ADD COLUMN motivo_manutencao TEXT DEFAULT 'Sistema em manutenção programada';

-- Atualizar as políticas RLS para permitir leitura pública do status de manutenção
DROP POLICY IF EXISTS "Todos podem ver status de manutenção" ON public.configuracoes_sistema;
DROP POLICY IF EXISTS "Apenas admins podem ver configurações" ON public.configuracoes_sistema;

-- Política para todos poderem ler configurações (necessário para verificar manutenção)
CREATE POLICY "Permitir leitura pública das configurações" 
ON public.configuracoes_sistema 
FOR SELECT 
USING (true);

-- Política para apenas admins atualizarem
CREATE POLICY "Apenas admins podem atualizar configurações" 
ON public.configuracoes_sistema 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'admin' 
    AND ativo = true
  )
);
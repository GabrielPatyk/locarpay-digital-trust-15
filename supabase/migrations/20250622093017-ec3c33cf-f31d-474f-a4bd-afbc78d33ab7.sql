
-- Adicionar campos para detalhes do pagamento
ALTER TABLE public.fiancas_locaticias 
ADD COLUMN IF NOT EXISTS metodo_pagamento TEXT,
ADD COLUMN IF NOT EXISTS prazo_pagamento TEXT,
ADD COLUMN IF NOT EXISTS situacao_pagamento TEXT DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS data_atualizacao_pagamento TIMESTAMP WITH TIME ZONE;

-- Atualizar fianças que estão com status aguardando_geracao_pagamento para pagamento_disponivel
UPDATE public.fiancas_locaticias 
SET status_fianca = 'pagamento_disponivel' 
WHERE status_fianca = 'aguardando_geracao_pagamento';

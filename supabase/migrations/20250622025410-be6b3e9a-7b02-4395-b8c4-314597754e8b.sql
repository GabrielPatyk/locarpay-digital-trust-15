
-- Adicionar novos status para o enum status_fianca
ALTER TYPE status_fianca ADD VALUE IF NOT EXISTS 'pagamento_disponivel';
ALTER TYPE status_fianca ADD VALUE IF NOT EXISTS 'comprovante_enviado';

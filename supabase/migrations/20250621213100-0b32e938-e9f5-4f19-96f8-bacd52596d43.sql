
-- Marcar todos os usuários existentes como verificados
UPDATE public.usuarios 
SET verificado = true 
WHERE verificado = false OR verificado IS NULL;

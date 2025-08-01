-- Corrigir a senha do usuário com hash válido
UPDATE public.usuarios 
SET senha = extensions.crypt('Gep04042005@!@', extensions.gen_salt('bf', 12))
WHERE email = 'patykytcontato@gmail.com';
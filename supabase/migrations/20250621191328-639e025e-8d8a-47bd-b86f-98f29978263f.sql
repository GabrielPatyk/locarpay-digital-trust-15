
-- Primeiro, vamos apagar todos os usuários existentes
DELETE FROM public.usuarios;

-- Agora vamos inserir os usuários com os emails corretos @locarpay.com.br
-- Usando a função hash_password para gerar senhas seguras
INSERT INTO public.usuarios (email, senha, nome, telefone, cargo) VALUES
('admin@locarpay.com.br', public.hash_password('123456'), 'Administrador do Sistema', '(11) 99999-8888', 'admin'),
('analista@locarpay.com.br', public.hash_password('123456'), 'Ana Costa Oliveira', '(11) 99999-3333', 'analista'),
('juridico@locarpay.com.br', public.hash_password('123456'), 'Carlos Mendes Santos', '(11) 99999-4444', 'juridico'),
('sdr@locarpay.com.br', public.hash_password('123456'), 'Maria Santos Lima', '(11) 99999-5555', 'sdr'),
('executivo@locarpay.com.br', public.hash_password('123456'), 'Pedro Lima Costa', '(11) 99999-6666', 'executivo'),
('imobiliaria@locarpay.com.br', public.hash_password('123456'), 'Roberto Silva - Imobiliária Prime Ltda', '(11) 99999-2222', 'imobiliaria'),
('inquilino@locarpay.com.br', public.hash_password('123456'), 'João Silva dos Santos', '(11) 99999-1111', 'inquilino'),
('financeiro@locarpay.com.br', public.hash_password('123456'), 'Lucas Oliveira Santos', '(11) 99999-7777', 'financeiro'),
('corretor@locarpay.com.br', public.hash_password('123456'), 'Marcos Silva Corretor', '(11) 99999-9999', 'corretor');

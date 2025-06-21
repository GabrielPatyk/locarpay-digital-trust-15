
-- Inserir usuários de demonstração na tabela auth.users
-- Nota: A senha será "123456" para todos os usuários de demonstração

-- Usuário Analista
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'analista@locarpay.com.br',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Usuário Jurídico
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'juridico@locarpay.com.br',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Usuário SDR
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'sdr@locarpay.com.br',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Usuário Executivo
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'executivo@locarpay.com.br',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Usuário Imobiliária
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'imobiliaria@locarpay.com.br',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Usuário Inquilino
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'inquilino@locarpay.com.br',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Usuário Financeiro
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'financeiro@locarpay.com.br',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Usuário Admin
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@locarpay.com.br',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Agora criar os perfis correspondentes na tabela profiles
-- Perfil Analista
INSERT INTO public.profiles (id, nome_completo, tipo_usuario, documento, telefone, data_nascimento)
SELECT 
  u.id,
  'Ana Costa Oliveira',
  'analista'::tipo_usuario,
  '123.456.789-01',
  '(11) 99999-0001',
  '1990-05-15'::date
FROM auth.users u 
WHERE u.email = 'analista@locarpay.com.br';

-- Perfil Jurídico
INSERT INTO public.profiles (id, nome_completo, tipo_usuario, documento, telefone, data_nascimento)
SELECT 
  u.id,
  'Carlos Mendes Santos',
  'juridico'::tipo_usuario,
  '123.456.789-02',
  '(11) 99999-0002',
  '1985-03-20'::date
FROM auth.users u 
WHERE u.email = 'juridico@locarpay.com.br';

-- Perfil SDR
INSERT INTO public.profiles (id, nome_completo, tipo_usuario, documento, telefone, data_nascimento)
SELECT 
  u.id,
  'Maria Santos Lima',
  'sdr'::tipo_usuario,
  '123.456.789-03',
  '(11) 99999-0003',
  '1992-08-10'::date
FROM auth.users u 
WHERE u.email = 'sdr@locarpay.com.br';

-- Perfil Executivo
INSERT INTO public.profiles (id, nome_completo, tipo_usuario, documento, telefone, data_nascimento)
SELECT 
  u.id,
  'Pedro Lima Costa',
  'executivo'::tipo_usuario,
  '123.456.789-04',
  '(11) 99999-0004',
  '1988-12-25'::date
FROM auth.users u 
WHERE u.email = 'executivo@locarpay.com.br';

-- Perfil Imobiliária
INSERT INTO public.profiles (id, nome_completo, tipo_usuario, documento, telefone, data_nascimento)
SELECT 
  u.id,
  'Roberto Silva Santos',
  'imobiliaria'::tipo_usuario,
  '12.345.678/0001-90',
  '(11) 99999-0005',
  '1980-01-15'::date
FROM auth.users u 
WHERE u.email = 'imobiliaria@locarpay.com.br';

-- Perfil Inquilino
INSERT INTO public.profiles (id, nome_completo, tipo_usuario, documento, telefone, data_nascimento)
SELECT 
  u.id,
  'João Silva dos Santos',
  'inquilino'::tipo_usuario,
  '123.456.789-06',
  '(11) 99999-0006',
  '1995-07-08'::date
FROM auth.users u 
WHERE u.email = 'inquilino@locarpay.com.br';

-- Perfil Financeiro
INSERT INTO public.profiles (id, nome_completo, tipo_usuario, documento, telefone, data_nascimento)
SELECT 
  u.id,
  'Lucas Oliveira Santos',
  'financeiro'::tipo_usuario,
  '123.456.789-07',
  '(11) 99999-0007',
  '1987-11-30'::date
FROM auth.users u 
WHERE u.email = 'financeiro@locarpay.com.br';

-- Perfil Admin
INSERT INTO public.profiles (id, nome_completo, tipo_usuario, documento, telefone, data_nascimento)
SELECT 
  u.id,
  'Administrador do Sistema',
  'admin'::tipo_usuario,
  '123.456.789-08',
  '(11) 99999-0008',
  '1985-04-12'::date
FROM auth.users u 
WHERE u.email = 'admin@locarpay.com.br';

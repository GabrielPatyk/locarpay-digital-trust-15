import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Função para validar senha comparando com hash personalizado
async function validatePassword(password: string, hash: string): Promise<boolean> {
  if (!hash.startsWith('$2a$10$')) {
    return false;
  }
  
  // Extrair salt e hash do formato $2a$10$salt$hash
  const saltBase64 = hash.substring(7, 29); // 22 caracteres após $2a$10$
  const storedHashBase64 = hash.substring(29); // resto é o hash
  
  try {
    // Decodificar salt
    const saltBytes = new Uint8Array(atob(saltBase64).split('').map(c => c.charCodeAt(0)));
    
    // Recriar hash com a mesma senha e salt
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password + saltBytes);
    
    let newHash = await crypto.subtle.digest('SHA-256', passwordBytes);
    
    // 1024 iterações para simular bcrypt com 10 rounds
    for (let i = 0; i < 1023; i++) {
      const combined = new Uint8Array(newHash.byteLength + saltBytes.length);
      combined.set(new Uint8Array(newHash));
      combined.set(saltBytes, newHash.byteLength);
      newHash = await crypto.subtle.digest('SHA-256', combined);
    }
    
    // Converter para base64 e comparar
    const newHashArray = Array.from(new Uint8Array(newHash));
    const newHashBase64 = btoa(String.fromCharCode(...newHashArray)).substring(0, 31);
    
    return newHashBase64 === storedHashBase64;
  } catch (error) {
    console.error('Erro ao validar senha:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email e senha são obrigatórios' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Conectar ao Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Buscar usuário por email
    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('id, email, nome, senha, verificado, ativo')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, message: 'Credenciais inválidas' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verificar se usuário está ativo
    if (!user.ativo) {
      return new Response(
        JSON.stringify({ success: false, message: 'Usuário inativo' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validar senha
    const isValidPassword = await validatePassword(password, user.senha);
    
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ success: false, message: 'Credenciais inválidas' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Retornar dados do usuário (sem a senha)
    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          nome: user.nome,
          verificado: user.verificado
        }
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na validação de login:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Erro interno do servidor' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
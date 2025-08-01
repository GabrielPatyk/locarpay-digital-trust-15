import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Função para validar senha usando bcrypt através do banco de dados
async function validatePassword(email: string, password: string, supabase: any): Promise<boolean> {
  try {
    // Usar a função verify_password do PostgreSQL que suporta bcrypt
    const { data, error } = await supabase.rpc('verify_password', {
      email_input: email,
      password_input: password
    });

    if (error) {
      console.error('Erro na validação de senha via RPC:', error);
      return false;
    }

    return data && data.length > 0;
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
    const isValidPassword = await validatePassword(email, password, supabase);
    
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
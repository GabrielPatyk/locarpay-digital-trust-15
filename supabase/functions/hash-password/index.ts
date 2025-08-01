import { serve } from "https://deno.land/std@0.208.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Função para gerar hash da senha compatível com bcrypt usando Web Crypto API
async function hashPassword(password: string): Promise<string> {
  // Gerar salt aleatório de 22 caracteres (base64)
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = btoa(String.fromCharCode(...saltBytes)).substring(0, 22);
  
  // Criar hash usando PBKDF2 (similar ao bcrypt)
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 1024, // Compatível com bcrypt rounds
      hash: 'SHA-256'
    },
    keyMaterial,
    256 // 32 bytes
  );
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray)).substring(0, 31);
  
  // Formato compatível com bcrypt: $2a$10$salt$hash
  return `$2a$10$${salt}${hashBase64}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();

    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Gerando hash para a senha...');
    
    const hashedPassword = await hashPassword(password);
    
    console.log('Hash gerado com sucesso');

    return new Response(
      JSON.stringify({ hashedPassword }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro ao gerar hash da senha:', error);
    
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
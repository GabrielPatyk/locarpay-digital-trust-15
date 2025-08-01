import { serve } from "https://deno.land/std@0.208.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Implementação simples de bcrypt-like usando Web Crypto
async function hashPassword(password: string): Promise<string> {
  // Gerar salt de 16 bytes
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  
  // Converter para formato bcrypt
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password + saltBytes);
  
  // Hash usando SHA-256 com múltiplas iterações (simula bcrypt rounds)
  let hash = await crypto.subtle.digest('SHA-256', passwordBytes);
  
  // 1024 iterações para simular bcrypt com 10 rounds
  for (let i = 0; i < 1023; i++) {
    const combined = new Uint8Array(hash.byteLength + saltBytes.length);
    combined.set(new Uint8Array(hash));
    combined.set(saltBytes, hash.byteLength);
    hash = await crypto.subtle.digest('SHA-256', combined);
  }
  
  // Converter para base64
  const hashArray = Array.from(new Uint8Array(hash));
  const hashBase64 = btoa(String.fromCharCode(...hashArray)).substring(0, 31);
  const saltBase64 = btoa(String.fromCharCode(...saltBytes)).substring(0, 22);
  
  // Retornar no formato bcrypt: $2a$10$salt$hash
  return `$2a$10$${saltBase64}${hashBase64}`;
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

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  try {
    const body: EmailRequest = await req.json();
    const { to, subject, html } = body;

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Dados obrigatórios ausentes: to, subject e html são necessários' 
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 400,
        }
      );
    }

    console.log(`Enviando e-mail para: ${to}`);
    console.log(`Assunto: ${subject}`);
    console.log('E-mail processado com sucesso');

    // Simular envio bem-sucedido
    // Em produção, você deve integrar com um serviço de e-mail real como Resend, SendGrid, etc.
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'E-mail enviado com sucesso!',
        messageId: `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Erro ao processar e-mail:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      }
    );
  }
});

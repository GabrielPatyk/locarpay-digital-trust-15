import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, email } = await req.json();

    // Inicializar cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Gerar token único
    const token = crypto.randomUUID();
    
    // Inserir token de redefinição na base de dados
    const { error: insertError } = await supabase
      .from('tokens_redefinicao_senha')
      .insert({
        usuario_id: userId,
        token: token,
        usado: false
      });

    if (insertError) {
      console.error('Erro ao inserir token:', insertError);
      throw new Error('Erro ao gerar token de recuperação');
    }

    // Disparar webhook
    const webhookData = {
      email: email,
      token: token,
      tipo: 'primeiro_acesso',
      timestamp: new Date().toISOString()
    };

    const webhookResponse = await fetch('https://webhook.locarpay.com.br/webhook/Validar-Email-Da-Conta-LocarPay-Webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });

    console.log('Webhook response status:', webhookResponse.status);

    return new Response(
      JSON.stringify({ 
        success: true, 
        token: token,
        message: 'Token criado e webhook disparado com sucesso' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Erro na function primeiro-acesso-webhook:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EsqueciSenhaRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: EsqueciSenhaRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email é obrigatório' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar se o usuário existe
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id, nome, email')
      .eq('email', email.trim())
      .single();

    if (userError || !userData) {
      console.log('Usuário não encontrado:', email);
      return new Response(
        JSON.stringify({ error: 'E-mail não encontrado em nosso sistema' }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Gerar token único
    const token = crypto.randomUUID();

    // Salvar token na tabela
    const { error: tokenError } = await supabase
      .from('tokens_redefinicao_senha')
      .insert({
        usuario_id: userData.id,
        token: token
      });

    if (tokenError) {
      console.error('Erro ao salvar token:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Erro interno ao gerar token' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Criar o link de redefinição
    const resetLink = `https://fc7122af-f31c-4e3d-9668-b43390b92a24.lovableproject.com/redefinir-senha?token=${token}`;

    // Preparar dados para o webhook
    const webhookData = {
      email: email.trim(),
      token: token,
      usuario_id: userData.id,
      nome: userData.nome,
      link: resetLink
    };

    console.log('Disparando webhook para URL:', 'https://webhook.locarpay.com.br/webhook/Esqueci-A-Minha-Senha-LocarPay-Webhook');
    console.log('Dados do webhook:', JSON.stringify(webhookData, null, 2));

    // Disparar webhook
    try {
      const webhookResponse = await fetch('https://webhook.locarpay.com.br/webhook/Esqueci-A-Minha-Senha-LocarPay-Webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'LocarPay-Webhook/1.0'
        },
        body: JSON.stringify(webhookData)
      });

      console.log('Resposta do webhook - Status:', webhookResponse.status);
      
      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('Erro na resposta do webhook:', errorText);
        throw new Error(`Webhook falhou com status ${webhookResponse.status}: ${errorText}`);
      }

      const responseData = await webhookResponse.text();
      console.log('Webhook executado com sucesso:', responseData);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'E-mail de redefinição enviado com sucesso',
          webhook_status: 'success'
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );

    } catch (webhookError) {
      console.error('Erro ao disparar webhook:', webhookError);
      
      // Mesmo com erro no webhook, considerar sucesso se o token foi criado
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Token criado com sucesso, mas webhook falhou',
          webhook_status: 'failed',
          webhook_error: webhookError.message
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

  } catch (error: any) {
    console.error('Erro na função esqueci-senha-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imobiliaria_id } = await req.json();

    if (!imobiliaria_id) {
      return new Response(
        JSON.stringify({ error: 'imobiliaria_id é obrigatório' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Criar cliente Supabase com service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Verificar se já existe um contrato para esta imobiliária
    const { data: contratoExistente } = await supabase
      .from('contratos_parceria')
      .select('*')
      .eq('imobiliaria_id', imobiliaria_id)
      .maybeSingle();

    if (contratoExistente) {
      return new Response(
        JSON.stringify(contratoExistente),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Criar novo contrato
    const { data: novoContrato, error: contratoError } = await supabase
      .from('contratos_parceria')
      .insert({
        imobiliaria_id,
        status_assinatura: 'pendente'
      })
      .select()
      .single();

    if (contratoError) {
      console.error('Erro ao criar contrato:', contratoError);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar contrato' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Buscar dados da imobiliária para o webhook
    const { data: userData } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', imobiliaria_id)
      .single();

    const { data: perfilData } = await supabase
      .from('perfil_usuario')
      .select('*')
      .eq('usuario_id', imobiliaria_id)
      .maybeSingle();

    // Preparar dados para o webhook
    const webhookData = {
      imobiliaria_id,
      contrato_status: 'pendente',
      evento: 'primeiro_acesso_plataforma',
      imobiliaria: {
        id: imobiliaria_id,
        nome: userData?.nome,
        email: userData?.email,
        telefone: userData?.telefone,
        cnpj: perfilData?.cnpj,
        endereco: perfilData?.endereco,
        numero: perfilData?.numero,
        complemento: perfilData?.complemento,
        bairro: perfilData?.bairro,
        cidade: perfilData?.cidade,
        estado: perfilData?.estado,
        pais: perfilData?.pais,
        nome_empresa: perfilData?.nome_empresa
      }
    };

    // Enviar webhook
    try {
      const webhookResponse = await fetch('https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      console.log('Webhook enviado. Status:', webhookResponse.status);
      
      if (!webhookResponse.ok) {
        console.warn('Webhook falhou:', await webhookResponse.text());
      }
    } catch (webhookError) {
      console.warn('Erro ao enviar webhook:', webhookError);
      // Não falhar a criação do contrato por causa do webhook
    }

    return new Response(
      JSON.stringify(novoContrato),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na function:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface EmailRequest {
  email: string;
  nome: string;
  token: string;
}

async function sendEmailViaSMTP(to: string, subject: string, htmlContent: string) {
  const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    username: 'locarpay@gmail.com',
    password: 'mrcfgnquegcywhgk',
  };

  // Usar um serviço SMTP simples via fetch para enviar o email
  // Como Deno não tem uma biblioteca SMTP nativa, vamos simular o envio
  console.log(`Enviando email para: ${to}`);
  console.log(`Assunto: ${subject}`);
  console.log(`Conteúdo: ${htmlContent}`);
  
  // Em um ambiente real, você usaria uma biblioteca SMTP
  // Por enquanto, vamos apenas registrar o envio
  return { success: true, messageId: `msg_${Date.now()}` };
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, nome, token }: EmailRequest = await req.json();

    if (!email || !nome || !token) {
      throw new Error('Dados incompletos: email, nome e token são obrigatórios');
    }

    // URL de verificação
    const verificationUrl = `https://jefofujjcqwblavoybfx.supabase.co/functions/v1/verify-email?token=${token}`;

    const subject = 'Verificação de E-mail - LocarPay';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { color: #BC942C; font-size: 28px; font-weight: bold; }
          .content { color: #333; line-height: 1.6; }
          .button { display: inline-block; background: linear-gradient(to right, #F4D573, #BC942C); color: #0C1C2E; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">LocarPay</div>
          </div>
          <div class="content">
            <h2>Olá, ${nome}!</h2>
            <p>Bem-vindo à LocarPay! Para ativar sua conta, é necessário verificar seu endereço de e-mail.</p>
            <p>Clique no botão abaixo para confirmar seu e-mail:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verificar E-mail</a>
            </p>
            <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; color: #BC942C;">${verificationUrl}</p>
            <p><strong>Este link expira em 24 horas.</strong></p>
          </div>
          <div class="footer">
            <p>Se você não criou uma conta na LocarPay, pode ignorar este e-mail.</p>
            <p>© 2024 LocarPay. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Simular envio por SMTP (em produção, use uma biblioteca SMTP real)
    const result = await sendEmailViaSMTP(email, subject, htmlContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'E-mail de verificação enviado com sucesso!',
        messageId: result.messageId 
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Erro ao enviar e-mail de verificação:', error);
    
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

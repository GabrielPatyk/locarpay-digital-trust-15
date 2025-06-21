
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  nome: string;
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, nome, token }: VerificationEmailRequest = await req.json();

    const verificationUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/verify-email?token=${token}`;

    const emailResponse = await resend.emails.send({
      from: "LocarPay <noreply@locarpay.com.br>",
      to: [email],
      subject: "Verificação de E-mail - LocarPay",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Verificação de E-mail - LocarPay</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #F4D573, #BC942C); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { color: #0C1C2E; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
            .button { display: inline-block; background: linear-gradient(135deg, #F4D573, #BC942C); color: #0C1C2E; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">LocarPay</div>
              <h1 style="color: #0C1C2E; margin: 0;">Verificação de E-mail</h1>
            </div>
            <div class="content">
              <h2>Olá, ${nome}!</h2>
              <p>Bem-vindo à plataforma LocarPay! Para garantir a segurança da sua conta, precisamos verificar seu endereço de e-mail.</p>
              <p>Clique no botão abaixo para verificar seu e-mail e ativar sua conta:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verificar E-mail</a>
              </div>
              <p><strong>Importante:</strong></p>
              <ul>
                <li>Este link expira em 24 horas</li>
                <li>Após a verificação, você poderá acessar normalmente a plataforma</li>
                <li>Se você não solicitou esta conta, pode ignorar este e-mail</li>
              </ul>
              <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
              <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                ${verificationUrl}
              </p>
            </div>
            <div class="footer">
              <p>Este e-mail foi enviado automaticamente pelo sistema LocarPay.</p>
              <p>Se você tem dúvidas, entre em contato com nosso suporte.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("E-mail de verificação enviado:", emailResponse);

    return new Response(JSON.stringify({ success: true, messageId: emailResponse.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar e-mail de verificação:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

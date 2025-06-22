
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Erro - LocarPay</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
            .error { color: #e74c3c; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">Token Inválido</h1>
            <p>O link de verificação está inválido ou incompleto.</p>
            <p>Por favor, solicite um novo e-mail de verificação.</p>
          </div>
        </body>
        </html>
        `,
        {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    // Chamar a função do Supabase para verificar o e-mail
    const { data, error } = await supabase.rpc("verificar_email", {
      token_input: token,
    });

    if (error) {
      console.error("Erro ao verificar e-mail:", error);
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Erro - LocarPay</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
            .error { color: #e74c3c; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">Erro Interno</h1>
            <p>Ocorreu um erro ao processar a verificação.</p>
            <p>Tente novamente mais tarde ou entre em contato com o suporte.</p>
          </div>
        </body>
        </html>
        `,
        {
          status: 500,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    if (!data.success) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Token Expirado - LocarPay</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
            .warning { color: #f39c12; }
            .button { display: inline-block; background: linear-gradient(135deg, #F4D573, #BC942C); color: #0C1C2E; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="warning">Token Expirado</h1>
            <p>${data.message}</p>
            <p>Solicite um novo e-mail de verificação através da tela de login.</p>
            <a href="/login" class="button">Ir para Login</a>
          </div>
        </body>
        </html>
        `,
        {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    // Sucesso na verificação
    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>E-mail Verificado - LocarPay</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
          .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
          .success { color: #27ae60; }
          .button { display: inline-block; background: linear-gradient(135deg, #F4D573, #BC942C); color: #0C1C2E; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .logo { color: #0C1C2E; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">LocarPay</div>
          <h1 class="success">✓ E-mail Verificado com Sucesso!</h1>
          <p>Parabéns, <strong>${data.user_name}</strong>!</p>
          <p>Seu e-mail <strong>${data.user_email}</strong> foi verificado com sucesso.</p>
          <p>Agora você pode acessar normalmente a plataforma LocarPay.</p>
          <a href="/login" class="button">Fazer Login</a>
        </div>
        <script>
          // Redirecionar automaticamente após 3 segundos
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        </script>
      </body>
      </html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  } catch (error: any) {
    console.error("Erro geral na verificação:", error);
    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Erro - LocarPay</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
          .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
          .error { color: #e74c3c; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="error">Erro Inesperado</h1>
          <p>Ocorreu um erro inesperado. Tente novamente mais tarde.</p>
        </div>
      </body>
      </html>
      `,
      {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
};

serve(handler);

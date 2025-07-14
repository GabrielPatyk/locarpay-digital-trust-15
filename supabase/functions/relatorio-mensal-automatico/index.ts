
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Calcular primeiro e último dia do mês anterior
    const hoje = new Date()
    const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
    const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0)
    
    const dataInicio = mesAnterior.toISOString().split('T')[0]
    const dataFim = ultimoDiaMesAnterior.toISOString().split('T')[0]

    console.log(`Gerando relatório mensal para período: ${dataInicio} até ${dataFim}`)

    // Buscar dados das fianças do mês anterior
    const { data: fiancasData, error } = await supabaseClient
      .from('fiancas_locaticias')
      .select(`
        *,
        usuarios!id_imobiliaria(nome),
        usuarios!id_analista(nome)
      `)
      .gte('data_criacao', dataInicio)
      .lte('data_criacao', dataFim + 'T23:59:59.999Z')
      .order('data_criacao', { ascending: false })

    if (error) {
      console.error('Erro ao buscar dados:', error)
      throw error
    }

    console.log(`Encontradas ${fiancasData?.length || 0} fianças para o período`)

    if (!fiancasData || fiancasData.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'Nenhum dado encontrado para o período',
          periodo: `${dataInicio} até ${dataFim}`,
          total: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Gerar XML do relatório
    const formatarData = (data: string) => {
      return new Date(data).toLocaleDateString('pt-BR') + ' ' + new Date(data).toLocaleTimeString('pt-BR')
    }

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
              xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
              xmlns:html="http://www.w3.org/TR/REC-html40">
      <Worksheet ss:Name="Relatório Mensal Automático">
        <Table>
          <Row>
            <Cell><Data ss:Type="String">ID Fiança</Data></Cell>
            <Cell><Data ss:Type="String">Data Criação</Data></Cell>
            <Cell><Data ss:Type="String">Status</Data></Cell>
            <Cell><Data ss:Type="String">Inquilino</Data></Cell>
            <Cell><Data ss:Type="String">CPF Inquilino</Data></Cell>
            <Cell><Data ss:Type="String">Imobiliária</Data></Cell>
            <Cell><Data ss:Type="String">Score Crédito</Data></Cell>
            <Cell><Data ss:Type="String">Taxa Aplicada</Data></Cell>
            <Cell><Data ss:Type="String">Valor Aluguel</Data></Cell>
            <Cell><Data ss:Type="String">Valor Fiança</Data></Cell>
            <Cell><Data ss:Type="String">Tipo Imóvel</Data></Cell>
            <Cell><Data ss:Type="String">Endereço Imóvel</Data></Cell>
          </Row>`

    fiancasData.forEach(fianca => {
      xmlContent += `
          <Row>
            <Cell><Data ss:Type="String">${fianca.id}</Data></Cell>
            <Cell><Data ss:Type="String">${formatarData(fianca.data_criacao)}</Data></Cell>
            <Cell><Data ss:Type="String">${fianca.status_fianca}</Data></Cell>
            <Cell><Data ss:Type="String">${fianca.inquilino_nome_completo}</Data></Cell>
            <Cell><Data ss:Type="String">${fianca.inquilino_cpf}</Data></Cell>
            <Cell><Data ss:Type="String">${fianca.usuarios?.nome || 'N/A'}</Data></Cell>
            <Cell><Data ss:Type="Number">${fianca.score_credito || 0}</Data></Cell>
            <Cell><Data ss:Type="Number">${fianca.taxa_aplicada || 0}</Data></Cell>
            <Cell><Data ss:Type="Number">${fianca.imovel_valor_aluguel}</Data></Cell>
            <Cell><Data ss:Type="Number">${fianca.valor_fianca || 0}</Data></Cell>
            <Cell><Data ss:Type="String">${fianca.imovel_tipo}</Data></Cell>
            <Cell><Data ss:Type="String">${fianca.imovel_endereco}, ${fianca.imovel_numero} - ${fianca.imovel_bairro}, ${fianca.imovel_cidade}/${fianca.imovel_estado}</Data></Cell>
          </Row>`
    })

    xmlContent += `
        </Table>
      </Worksheet>
    </Workbook>`

    // Salvar arquivo no Storage
    const nomeArquivo = `relatorio-automatico-${mesAnterior.getFullYear()}-${String(mesAnterior.getMonth() + 1).padStart(2, '0')}.xml`
    
    const { error: uploadError } = await supabaseClient.storage
      .from('comprovantes')
      .upload(`relatorios-automaticos/${nomeArquivo}`, xmlContent, {
        contentType: 'application/vnd.ms-excel',
        upsert: true
      })

    if (uploadError) {
      console.error('Erro ao salvar arquivo:', uploadError)
      throw uploadError
    }

    console.log(`Relatório salvo com sucesso: ${nomeArquivo}`)

    // Calcular estatísticas do relatório
    const totalAnalises = fiancasData.length
    const aprovacoes = fiancasData.filter(f => f.status_fianca === 'aprovada').length
    const reprovacoes = fiancasData.filter(f => f.status_fianca === 'rejeitada').length
    const pendentes = fiancasData.filter(f => f.status_fianca === 'em_analise').length

    return new Response(
      JSON.stringify({
        message: 'Relatório mensal gerado com sucesso',
        nomeArquivo,
        periodo: `${dataInicio} até ${dataFim}`,
        estatisticas: {
          totalAnalises,
          aprovacoes,
          reprovacoes,
          pendentes
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Erro na geração do relatório:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Erro ao gerar relatório mensal automático'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

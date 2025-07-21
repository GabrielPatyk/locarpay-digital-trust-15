export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      configuracoes_sistema: {
        Row: {
          created_at: string
          id: string
          manutencao_ativa: boolean
          motivo_manutencao: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          manutencao_ativa?: boolean
          motivo_manutencao?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          manutencao_ativa?: boolean
          motivo_manutencao?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contratos_fianca: {
        Row: {
          assinantes: Json | null
          created_at: string | null
          data_assinatura: string | null
          data_envio: string | null
          documentos: Json | null
          fianca_id: string
          id: string
          selfie_url: string | null
          status_contrato: string
          updated_at: string | null
          url_contrato: string | null
        }
        Insert: {
          assinantes?: Json | null
          created_at?: string | null
          data_assinatura?: string | null
          data_envio?: string | null
          documentos?: Json | null
          fianca_id: string
          id?: string
          selfie_url?: string | null
          status_contrato?: string
          updated_at?: string | null
          url_contrato?: string | null
        }
        Update: {
          assinantes?: Json | null
          created_at?: string | null
          data_assinatura?: string | null
          data_envio?: string | null
          documentos?: Json | null
          fianca_id?: string
          id?: string
          selfie_url?: string | null
          status_contrato?: string
          updated_at?: string | null
          url_contrato?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_fianca_fianca_id_fkey"
            columns: ["fianca_id"]
            isOneToOne: false
            referencedRelation: "fiancas_locaticias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_fianca_fianca_id_fkey"
            columns: ["fianca_id"]
            isOneToOne: false
            referencedRelation: "fiancas_para_analise"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos_parceria: {
        Row: {
          created_at: string | null
          documento_assinado_url: string | null
          id: string
          imobiliaria_id: string
          link_assinatura: string | null
          status_assinatura: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          documento_assinado_url?: string | null
          id?: string
          imobiliaria_id: string
          link_assinatura?: string | null
          status_assinatura?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          documento_assinado_url?: string | null
          id?: string
          imobiliaria_id?: string
          link_assinatura?: string | null
          status_assinatura?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_parceria_imobiliaria_id_fkey"
            columns: ["imobiliaria_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      fiancas_locaticias: {
        Row: {
          comprovante_pagamento: string | null
          criado_por: string | null
          data_analise: string | null
          data_aprovacao: string | null
          data_atualizacao: string
          data_atualizacao_pagamento: string | null
          data_comprovante: string | null
          data_criacao: string
          data_envio_link: string | null
          data_vencimento: string | null
          financeiro_id: string | null
          id: string
          id_analista: string | null
          id_imobiliaria: string
          imovel_area_metros: number | null
          imovel_bairro: string
          imovel_cidade: string
          imovel_complemento: string | null
          imovel_descricao: string | null
          imovel_endereco: string
          imovel_estado: string
          imovel_numero: string
          imovel_pais: string
          imovel_tempo_locacao: number
          imovel_tipo: string
          imovel_tipo_locacao: string
          imovel_valor_aluguel: number
          inquilino_bairro: string
          inquilino_cidade: string
          inquilino_complemento: string | null
          inquilino_cpf: string
          inquilino_email: string
          inquilino_endereco: string
          inquilino_estado: string
          inquilino_nome_completo: string
          inquilino_numero: string
          inquilino_pais: string
          inquilino_renda_mensal: number
          inquilino_usuario_id: string | null
          inquilino_whatsapp: string
          link_pagamento: string | null
          metodo_pagamento: string | null
          motivo_reprovacao: string | null
          observacoes_aprovacao: string | null
          prazo_pagamento: string | null
          score_credito: number | null
          situacao_pagamento: string | null
          status_fianca: Database["public"]["Enums"]["status_fianca"]
          taxa_aplicada: number | null
          valor_fianca: number | null
          valor_total_locacao: number | null
        }
        Insert: {
          comprovante_pagamento?: string | null
          criado_por?: string | null
          data_analise?: string | null
          data_aprovacao?: string | null
          data_atualizacao?: string
          data_atualizacao_pagamento?: string | null
          data_comprovante?: string | null
          data_criacao?: string
          data_envio_link?: string | null
          data_vencimento?: string | null
          financeiro_id?: string | null
          id?: string
          id_analista?: string | null
          id_imobiliaria: string
          imovel_area_metros?: number | null
          imovel_bairro: string
          imovel_cidade: string
          imovel_complemento?: string | null
          imovel_descricao?: string | null
          imovel_endereco: string
          imovel_estado: string
          imovel_numero: string
          imovel_pais?: string
          imovel_tempo_locacao: number
          imovel_tipo: string
          imovel_tipo_locacao: string
          imovel_valor_aluguel: number
          inquilino_bairro: string
          inquilino_cidade: string
          inquilino_complemento?: string | null
          inquilino_cpf: string
          inquilino_email: string
          inquilino_endereco: string
          inquilino_estado: string
          inquilino_nome_completo: string
          inquilino_numero: string
          inquilino_pais?: string
          inquilino_renda_mensal: number
          inquilino_usuario_id?: string | null
          inquilino_whatsapp: string
          link_pagamento?: string | null
          metodo_pagamento?: string | null
          motivo_reprovacao?: string | null
          observacoes_aprovacao?: string | null
          prazo_pagamento?: string | null
          score_credito?: number | null
          situacao_pagamento?: string | null
          status_fianca?: Database["public"]["Enums"]["status_fianca"]
          taxa_aplicada?: number | null
          valor_fianca?: number | null
          valor_total_locacao?: number | null
        }
        Update: {
          comprovante_pagamento?: string | null
          criado_por?: string | null
          data_analise?: string | null
          data_aprovacao?: string | null
          data_atualizacao?: string
          data_atualizacao_pagamento?: string | null
          data_comprovante?: string | null
          data_criacao?: string
          data_envio_link?: string | null
          data_vencimento?: string | null
          financeiro_id?: string | null
          id?: string
          id_analista?: string | null
          id_imobiliaria?: string
          imovel_area_metros?: number | null
          imovel_bairro?: string
          imovel_cidade?: string
          imovel_complemento?: string | null
          imovel_descricao?: string | null
          imovel_endereco?: string
          imovel_estado?: string
          imovel_numero?: string
          imovel_pais?: string
          imovel_tempo_locacao?: number
          imovel_tipo?: string
          imovel_tipo_locacao?: string
          imovel_valor_aluguel?: number
          inquilino_bairro?: string
          inquilino_cidade?: string
          inquilino_complemento?: string | null
          inquilino_cpf?: string
          inquilino_email?: string
          inquilino_endereco?: string
          inquilino_estado?: string
          inquilino_nome_completo?: string
          inquilino_numero?: string
          inquilino_pais?: string
          inquilino_renda_mensal?: number
          inquilino_usuario_id?: string | null
          inquilino_whatsapp?: string
          link_pagamento?: string | null
          metodo_pagamento?: string | null
          motivo_reprovacao?: string | null
          observacoes_aprovacao?: string | null
          prazo_pagamento?: string | null
          score_credito?: number | null
          situacao_pagamento?: string | null
          status_fianca?: Database["public"]["Enums"]["status_fianca"]
          taxa_aplicada?: number | null
          valor_fianca?: number | null
          valor_total_locacao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fiancas_locaticias_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiancas_locaticias_financeiro_id_fkey"
            columns: ["financeiro_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiancas_locaticias_id_analista_fkey"
            columns: ["id_analista"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiancas_locaticias_id_imobiliaria_fkey"
            columns: ["id_imobiliaria"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiancas_locaticias_id_imobiliaria_idx"
            columns: ["id_imobiliaria"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiancas_locaticias_inquilino_usuario_id_fkey"
            columns: ["inquilino_usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_fiancas: {
        Row: {
          acao: string
          analisado_por: string | null
          data_criacao: string
          detalhes: string | null
          fianca_id: string
          id: string
          usuario_id: string | null
          usuario_nome: string
        }
        Insert: {
          acao: string
          analisado_por?: string | null
          data_criacao?: string
          detalhes?: string | null
          fianca_id: string
          id?: string
          usuario_id?: string | null
          usuario_nome: string
        }
        Update: {
          acao?: string
          analisado_por?: string | null
          data_criacao?: string
          detalhes?: string | null
          fianca_id?: string
          id?: string
          usuario_id?: string | null
          usuario_nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_fiancas_analisado_por_fkey"
            columns: ["analisado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_fiancas_fianca_id_fkey"
            columns: ["fianca_id"]
            isOneToOne: false
            referencedRelation: "fiancas_locaticias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_fiancas_fianca_id_fkey"
            columns: ["fianca_id"]
            isOneToOne: false
            referencedRelation: "fiancas_para_analise"
            referencedColumns: ["id"]
          },
        ]
      }
      perfil_usuario: {
        Row: {
          atualizado_em: string
          bairro: string | null
          cidade: string | null
          cnpj: string | null
          complemento: string | null
          criado_em: string
          endereco: string | null
          estado: string | null
          id: string
          nome_empresa: string | null
          numero: string | null
          pais: string | null
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string
          bairro?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          criado_em?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome_empresa?: string | null
          numero?: string | null
          pais?: string | null
          usuario_id: string
        }
        Update: {
          atualizado_em?: string
          bairro?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          criado_em?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome_empresa?: string | null
          numero?: string | null
          pais?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_usuario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens_redefinicao_senha: {
        Row: {
          criado_em: string
          id: string
          token: string
          usado: boolean
          usuario_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          token: string
          usado?: boolean
          usuario_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          token?: string
          usado?: boolean
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tokens_redefinicao_senha_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          cargo: string
          cpf: string | null
          criado_em: string | null
          criado_por: string | null
          email: string
          id: string
          imagem_perfil: string | null
          nome: string
          primeiro_acesso: boolean | null
          senha: string
          telefone: string | null
          token_expira_em: string | null
          token_verificacao: string | null
          verificado: boolean | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cargo: string
          cpf?: string | null
          criado_em?: string | null
          criado_por?: string | null
          email: string
          id?: string
          imagem_perfil?: string | null
          nome: string
          primeiro_acesso?: boolean | null
          senha: string
          telefone?: string | null
          token_expira_em?: string | null
          token_verificacao?: string | null
          verificado?: boolean | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cargo?: string
          cpf?: string | null
          criado_em?: string | null
          criado_por?: string | null
          email?: string
          id?: string
          imagem_perfil?: string | null
          nome?: string
          primeiro_acesso?: boolean | null
          senha?: string
          telefone?: string | null
          token_expira_em?: string | null
          token_verificacao?: string | null
          verificado?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios_imobiliaria: {
        Row: {
          criado_em: string | null
          id: string
          imobiliaria_id: string
          usuario_id: string
        }
        Insert: {
          criado_em?: string | null
          id?: string
          imobiliaria_id: string
          usuario_id: string
        }
        Update: {
          criado_em?: string | null
          id?: string
          imobiliaria_id?: string
          usuario_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      fiancas_para_analise: {
        Row: {
          data_analise: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          data_vencimento: string | null
          id: string | null
          id_imobiliaria: string | null
          imobiliaria_nome: string | null
          imobiliaria_responsavel: string | null
          imovel_area_metros: number | null
          imovel_bairro: string | null
          imovel_cidade: string | null
          imovel_complemento: string | null
          imovel_descricao: string | null
          imovel_endereco: string | null
          imovel_estado: string | null
          imovel_numero: string | null
          imovel_pais: string | null
          imovel_tempo_locacao: number | null
          imovel_tipo: string | null
          imovel_tipo_locacao: string | null
          imovel_valor_aluguel: number | null
          inquilino_bairro: string | null
          inquilino_cidade: string | null
          inquilino_complemento: string | null
          inquilino_cpf: string | null
          inquilino_email: string | null
          inquilino_endereco: string | null
          inquilino_estado: string | null
          inquilino_nome_completo: string | null
          inquilino_numero: string | null
          inquilino_pais: string | null
          inquilino_renda_mensal: number | null
          inquilino_whatsapp: string | null
          motivo_reprovacao: string | null
          score_credito: number | null
          status_fianca: Database["public"]["Enums"]["status_fianca"] | null
          taxa_aplicada: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fiancas_locaticias_id_imobiliaria_fkey"
            columns: ["id_imobiliaria"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiancas_locaticias_id_imobiliaria_idx"
            columns: ["id_imobiliaria"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      atualizar_data_aprovacao: {
        Args: { p_id: string; p_data_aprovacao: string }
        Returns: undefined
      }
      atualizar_imagem_perfil: {
        Args: { p_usuario_id: string; p_imagem_url: string }
        Returns: boolean
      }
      criar_contrato_apos_pagamento: {
        Args: { pagamento_id: string }
        Returns: undefined
      }
      criar_contrato_imobiliaria: {
        Args: { p_param1: number; p_param2: string }
        Returns: undefined
      }
      criar_perfil_usuario_se_necessario: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      gerar_token_verificacao: {
        Args: { usuario_id: string }
        Returns: string
      }
      get_current_user_email: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: string
      }
      get_current_user_from_jwt: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_id_from_jwt: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_id_by_email: {
        Args: Record<PropertyKey, never> | { p_email: string }
        Returns: string
      }
      hash_password: {
        Args: { password: string }
        Returns: string
      }
      inserir_historico_criacao_fianca: {
        Args: { p_fianca_id: string; p_usuario_id: string; p_valor: number }
        Returns: undefined
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_imobiliaria: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_superadmin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_is_signer: {
        Args:
          | { contract_signers: Json }
          | { p_user_id: string; p_document_id: string }
        Returns: boolean
      }
      validar_login: {
        Args: { email_input: string; senha_input: string }
        Returns: {
          id: string
          email: string
          nome: string
          telefone: string
          cargo: string
          ativo: boolean
          verificado: boolean
        }[]
      }
      verificar_email: {
        Args: { p_email: string } | { token_input: string }
        Returns: boolean
      }
      verify_password: {
        Args: { password: string } | { password: string; hash: string }
        Returns: boolean
      }
    }
    Enums: {
      status_fianca:
        | "em_analise"
        | "aprovada"
        | "rejeitada"
        | "ativa"
        | "vencida"
        | "cancelada"
        | "enviada_ao_financeiro"
        | "aguardando_geracao_pagamento"
        | "pagamento_disponivel"
        | "comprovante_enviado"
        | "assinatura_imobiliaria"
        | "pagamento_confirmado"
      tipo_usuario:
        | "inquilino"
        | "analista"
        | "juridico"
        | "admin"
        | "sdr"
        | "executivo"
        | "imobiliaria"
        | "financeiro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      status_fianca: [
        "em_analise",
        "aprovada",
        "rejeitada",
        "ativa",
        "vencida",
        "cancelada",
        "enviada_ao_financeiro",
        "aguardando_geracao_pagamento",
        "pagamento_disponivel",
        "comprovante_enviado",
        "assinatura_imobiliaria",
        "pagamento_confirmado",
      ],
      tipo_usuario: [
        "inquilino",
        "analista",
        "juridico",
        "admin",
        "sdr",
        "executivo",
        "imobiliaria",
        "financeiro",
      ],
    },
  },
} as const

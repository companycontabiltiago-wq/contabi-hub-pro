export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      client_documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          notes: string | null
          owner_id: string
          uploaded_by: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          notes?: string | null
          owner_id: string
          uploaded_by: string
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          notes?: string | null
          owner_id?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      client_resources: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          title: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: Database["public"]["Enums"]["news_category"]
          content: string
          created_at: string
          id: string
          image_url: string | null
          published: boolean
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["news_category"]
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["news_category"]
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      plan_leads: {
        Row: {
          cnpj: string | null
          company_name: string | null
          contact_name: string
          created_at: string
          current_accountant: boolean | null
          email: string
          employees_clt: number
          has_cnpj: boolean
          id: string
          monthly_revenue: number | null
          notes: string | null
          phone: string
          plan_name: string
          preferred_contact: string | null
          segment: Database["public"]["Enums"]["business_segment"]
          tax_regime: Database["public"]["Enums"]["tax_regime"]
        }
        Insert: {
          cnpj?: string | null
          company_name?: string | null
          contact_name: string
          created_at?: string
          current_accountant?: boolean | null
          email: string
          employees_clt?: number
          has_cnpj?: boolean
          id?: string
          monthly_revenue?: number | null
          notes?: string | null
          phone: string
          plan_name: string
          preferred_contact?: string | null
          segment: Database["public"]["Enums"]["business_segment"]
          tax_regime: Database["public"]["Enums"]["tax_regime"]
        }
        Update: {
          cnpj?: string | null
          company_name?: string | null
          contact_name?: string
          created_at?: string
          current_accountant?: boolean | null
          email?: string
          employees_clt?: number
          has_cnpj?: boolean
          id?: string
          monthly_revenue?: number | null
          notes?: string | null
          phone?: string
          plan_name?: string
          preferred_contact?: string | null
          segment?: Database["public"]["Enums"]["business_segment"]
          tax_regime?: Database["public"]["Enums"]["tax_regime"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client"
      business_segment: "comercio" | "servico" | "industria" | "outros"
      document_category:
        | "fiscal"
        | "folha"
        | "contabil"
        | "societario"
        | "outros"
      news_category: "tributaria" | "trabalhista" | "previdenciaria"
      tax_regime:
        | "mei"
        | "simples_nacional"
        | "lucro_presumido"
        | "lucro_real"
        | "nao_sei"
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
      app_role: ["admin", "client"],
      business_segment: ["comercio", "servico", "industria", "outros"],
      document_category: [
        "fiscal",
        "folha",
        "contabil",
        "societario",
        "outros",
      ],
      news_category: ["tributaria", "trabalhista", "previdenciaria"],
      tax_regime: [
        "mei",
        "simples_nacional",
        "lucro_presumido",
        "lucro_real",
        "nao_sei",
      ],
    },
  },
} as const

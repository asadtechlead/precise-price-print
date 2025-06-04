export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          balance: number | null
          city: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          state: string | null
          user_id: string
          zip: string | null
        }
        Insert: {
          address?: string | null
          balance?: number | null
          city?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          state?: string | null
          user_id: string
          zip?: string | null
        }
        Update: {
          address?: string | null
          balance?: number | null
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          state?: string | null
          user_id?: string
          zip?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          client_id: string
          created_at: string
          due_date: string
          id: string
          invoice_number: string
          items: Json
          notes: string | null
          paid_at: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          total: number
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          due_date: string
          id?: string
          invoice_number: string
          items?: Json
          notes?: string | null
          paid_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          due_date?: string
          id?: string
          invoice_number?: string
          items?: Json
          notes?: string | null
          paid_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          stock_quantity: number | null
          track_stock: boolean | null
          unit: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price: number
          stock_quantity?: number | null
          track_stock?: boolean | null
          unit?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          stock_quantity?: number | null
          track_stock?: boolean | null
          unit?: string
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          hourly_rate: number
          id: string
          name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          hourly_rate: number
          id?: string
          name: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          hourly_rate?: number
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          company_address: string | null
          company_city: string | null
          company_email: string | null
          company_name: string | null
          company_phone: string | null
          company_state: string | null
          company_tax_id: string | null
          company_website: string | null
          company_zip: string | null
          created_at: string
          default_currency_code: string | null
          default_due_days: number | null
          default_tax_rate: number | null
          email_reminders: boolean | null
          footer_text: string | null
          id: string
          invoice_prefix: string | null
          invoice_template: string | null
          new_invoice: boolean | null
          overdue_alerts: boolean | null
          payment_received: boolean | null
          payment_terms: string | null
          primary_color: string | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_address?: string | null
          company_city?: string | null
          company_email?: string | null
          company_name?: string | null
          company_phone?: string | null
          company_state?: string | null
          company_tax_id?: string | null
          company_website?: string | null
          company_zip?: string | null
          created_at?: string
          default_currency_code?: string | null
          default_due_days?: number | null
          default_tax_rate?: number | null
          email_reminders?: boolean | null
          footer_text?: string | null
          id?: string
          invoice_prefix?: string | null
          invoice_template?: string | null
          new_invoice?: boolean | null
          overdue_alerts?: boolean | null
          payment_received?: boolean | null
          payment_terms?: string | null
          primary_color?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_address?: string | null
          company_city?: string | null
          company_email?: string | null
          company_name?: string | null
          company_phone?: string | null
          company_state?: string | null
          company_tax_id?: string | null
          company_website?: string | null
          company_zip?: string | null
          created_at?: string
          default_currency_code?: string | null
          default_due_days?: number | null
          default_tax_rate?: number | null
          email_reminders?: boolean | null
          footer_text?: string | null
          id?: string
          invoice_prefix?: string | null
          invoice_template?: string | null
          new_invoice?: boolean | null
          overdue_alerts?: boolean | null
          payment_received?: boolean | null
          payment_terms?: string | null
          primary_color?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

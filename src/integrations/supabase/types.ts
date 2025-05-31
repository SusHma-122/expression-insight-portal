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
      classifier_results: {
        Row: {
          accession_id: string
          accuracy: number | null
          confusion_matrix: Json | null
          created_at: string | null
          id: string
          model_type: string | null
          roc_auc: number | null
        }
        Insert: {
          accession_id: string
          accuracy?: number | null
          confusion_matrix?: Json | null
          created_at?: string | null
          id?: string
          model_type?: string | null
          roc_auc?: number | null
        }
        Update: {
          accession_id?: string
          accuracy?: number | null
          confusion_matrix?: Json | null
          created_at?: string | null
          id?: string
          model_type?: string | null
          roc_auc?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "classifier_results_accession_id_fkey"
            columns: ["accession_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["accession_id"]
          },
        ]
      }
      datasets: {
        Row: {
          accession_id: string
          desciption: string | null
          disease_count: number | null
          id: string
          normal_count: number | null
          organism: string | null
          sample_count: number | null
        }
        Insert: {
          accession_id?: string
          desciption?: string | null
          disease_count?: number | null
          id?: string
          normal_count?: number | null
          organism?: string | null
          sample_count?: number | null
        }
        Update: {
          accession_id?: string
          desciption?: string | null
          disease_count?: number | null
          id?: string
          normal_count?: number | null
          organism?: string | null
          sample_count?: number | null
        }
        Relationships: []
      }
      differential_genes: {
        Row: {
          accession_id: string
          adj_p_value: number | null
          gene_symbol: string
          id: string
          log2fc: number | null
          p_value: number | null
        }
        Insert: {
          accession_id: string
          adj_p_value?: number | null
          gene_symbol?: string
          id?: string
          log2fc?: number | null
          p_value?: number | null
        }
        Update: {
          accession_id?: string
          adj_p_value?: number | null
          gene_symbol?: string
          id?: string
          log2fc?: number | null
          p_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "differential_genes_accession_id_fkey"
            columns: ["accession_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["accession_id"]
          },
        ]
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

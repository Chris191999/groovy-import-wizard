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
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["app_status"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["app_status"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["app_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          commission_breakdown: string | null
          confidence_rating: number | null
          created_at: string
          date: string | null
          direction: string | null
          economic_events: string | null
          emotion: string | null
          entry: number | null
          entry_liq: string | null
          exit: number | null
          fees: number | null
          id: string
          image_files: string[] | null
          liq_entry_breakeven_risk: string | null
          liquidity: string | null
          market_condition: string | null
          market_condition_detailed: string | null
          market_volatility: string | null
          max_adverse_excursion: number | null
          max_favorable_excursion: number | null
          mistake_category: string | null
          notes: string | null
          order_liq: string | null
          order_type: string | null
          planned_vs_actual_pnl: number | null
          pnducm_imbalance: string | null
          pnl: number | null
          position_size: number | null
          post_trade_reflection: string | null
          quantity: number | null
          risk: number | null
          rules_followed: boolean | null
          setup_type: string | null
          slippage: number | null
          status: string | null
          strategy_name: string | null
          symbol: string | null
          test_type: string | null
          time_of_day: string | null
          timeframe: string | null
          trade_duration_hours: number | null
          trade_type: string | null
          user_id: string
        }
        Insert: {
          commission_breakdown?: string | null
          confidence_rating?: number | null
          created_at?: string
          date?: string | null
          direction?: string | null
          economic_events?: string | null
          emotion?: string | null
          entry?: number | null
          entry_liq?: string | null
          exit?: number | null
          fees?: number | null
          id: string
          image_files?: string[] | null
          liq_entry_breakeven_risk?: string | null
          liquidity?: string | null
          market_condition?: string | null
          market_condition_detailed?: string | null
          market_volatility?: string | null
          max_adverse_excursion?: number | null
          max_favorable_excursion?: number | null
          mistake_category?: string | null
          notes?: string | null
          order_liq?: string | null
          order_type?: string | null
          planned_vs_actual_pnl?: number | null
          pnducm_imbalance?: string | null
          pnl?: number | null
          position_size?: number | null
          post_trade_reflection?: string | null
          quantity?: number | null
          risk?: number | null
          rules_followed?: boolean | null
          setup_type?: string | null
          slippage?: number | null
          status?: string | null
          strategy_name?: string | null
          symbol?: string | null
          test_type?: string | null
          time_of_day?: string | null
          timeframe?: string | null
          trade_duration_hours?: number | null
          trade_type?: string | null
          user_id: string
        }
        Update: {
          commission_breakdown?: string | null
          confidence_rating?: number | null
          created_at?: string
          date?: string | null
          direction?: string | null
          economic_events?: string | null
          emotion?: string | null
          entry?: number | null
          entry_liq?: string | null
          exit?: number | null
          fees?: number | null
          id?: string
          image_files?: string[] | null
          liq_entry_breakeven_risk?: string | null
          liquidity?: string | null
          market_condition?: string | null
          market_condition_detailed?: string | null
          market_volatility?: string | null
          max_adverse_excursion?: number | null
          max_favorable_excursion?: number | null
          mistake_category?: string | null
          notes?: string | null
          order_liq?: string | null
          order_type?: string | null
          planned_vs_actual_pnl?: number | null
          pnducm_imbalance?: string | null
          pnl?: number | null
          position_size?: number | null
          post_trade_reflection?: string | null
          quantity?: number | null
          risk?: number | null
          rules_followed?: boolean | null
          setup_type?: string | null
          slippage?: number | null
          status?: string | null
          strategy_name?: string | null
          symbol?: string | null
          test_type?: string | null
          time_of_day?: string | null
          timeframe?: string | null
          trade_duration_hours?: number | null
          trade_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_profiles_with_email: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          updated_at: string
          full_name: string
          avatar_url: string
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["app_status"]
          email: string
          storage_used: number
        }[]
      }
      get_user_status_by_email: {
        Args: { p_email: string }
        Returns: Database["public"]["Enums"]["app_status"]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      app_status: "pending_approval" | "active" | "inactive"
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
    Enums: {
      app_role: ["admin", "user"],
      app_status: ["pending_approval", "active", "inactive"],
    },
  },
} as const

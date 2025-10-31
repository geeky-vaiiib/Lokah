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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alternate_selves: {
        Row: {
          axis: string
          backstory: string
          created_at: string
          different_traits: string[]
          divergence_summary: string
          id: string
          shared_traits: string[]
          user_id: string
        }
        Insert: {
          axis: string
          backstory: string
          created_at?: string
          different_traits?: string[]
          divergence_summary: string
          id?: string
          shared_traits?: string[]
          user_id: string
        }
        Update: {
          axis?: string
          backstory?: string
          created_at?: string
          different_traits?: string[]
          divergence_summary?: string
          id?: string
          shared_traits?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alternate_selves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          alternate_self_id: string
          created_at: string
          id: string
          messages: Json
          user_id: string
        }
        Insert: {
          alternate_self_id: string
          created_at?: string
          id?: string
          messages?: Json
          user_id: string
        }
        Update: {
          alternate_self_id?: string
          created_at?: string
          id?: string
          messages?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_alternate_self_id_fkey"
            columns: ["alternate_self_id"]
            isOneToOne: false
            referencedRelation: "alternate_selves"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_snippets: {
        Row: {
          alternate_self_id: string
          content: string
          conversation_id: string
          created_at: string
          emotional_tone: string | null
          id: string
          user_id: string
        }
        Insert: {
          alternate_self_id: string
          content: string
          conversation_id: string
          created_at?: string
          emotional_tone?: string | null
          id?: string
          user_id: string
        }
        Update: {
          alternate_self_id?: string
          content?: string
          conversation_id?: string
          created_at?: string
          emotional_tone?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_snippets_alternate_self_id_fkey"
            columns: ["alternate_self_id"]
            isOneToOne: false
            referencedRelation: "alternate_selves"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_snippets_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reflections: {
        Row: {
          alternate_self_id: string
          conversation_id: string
          created_at: string
          id: string
          insights: Json
          title: string
          user_id: string
        }
        Insert: {
          alternate_self_id: string
          conversation_id: string
          created_at?: string
          id?: string
          insights?: Json
          title: string
          user_id: string
        }
        Update: {
          alternate_self_id?: string
          conversation_id?: string
          created_at?: string
          id?: string
          insights?: Json
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reflections_alternate_self_id_fkey"
            columns: ["alternate_self_id"]
            isOneToOne: false
            referencedRelation: "alternate_selves"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reflections_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          age: number | null
          auth_user_id: string | null
          created_at: string
          gender: string | null
          id: string
          location: string | null
          major_choices: string[]
          name: string
          unchosen_path: string
          values: string[]
        }
        Insert: {
          age?: number | null
          auth_user_id?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          location?: string | null
          major_choices?: string[]
          name: string
          unchosen_path: string
          values?: string[]
        }
        Update: {
          age?: number | null
          auth_user_id?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          location?: string | null
          major_choices?: string[]
          name?: string
          unchosen_path?: string
          values?: string[]
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
    Enums: {},
  },
} as const

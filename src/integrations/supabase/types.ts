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
      broken_links: {
        Row: {
          checked_at: string
          path: string
          source_post_id: number | null
          suggested: string | null
        }
        Insert: {
          checked_at?: string
          path: string
          source_post_id?: number | null
          suggested?: string | null
        }
        Update: {
          checked_at?: string
          path?: string
          source_post_id?: number | null
          suggested?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          looking_for: string | null
          message: string
          name: string
          phone: string | null
          source_path: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          looking_for?: string | null
          message: string
          name: string
          phone?: string | null
          source_path?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          looking_for?: string | null
          message?: string
          name?: string
          phone?: string | null
          source_path?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      content_stats_snapshot: {
        Row: {
          generated_at: string
          id: number
          payload: Json
        }
        Insert: {
          generated_at?: string
          id?: number
          payload?: Json
        }
        Update: {
          generated_at?: string
          id?: number
          payload?: Json
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source_path: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source_path?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source_path?: string | null
        }
        Relationships: []
      }
      redirects: {
        Row: {
          created_at: string
          from_path: string
          to_path: string
        }
        Insert: {
          created_at?: string
          from_path: string
          to_path: string
        }
        Update: {
          created_at?: string
          from_path?: string
          to_path?: string
        }
        Relationships: []
      }
      seo_audit_findings: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          kind: string
          resolved: boolean
          severity: string
          target_kind: string | null
          target_path: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          kind: string
          resolved?: boolean
          severity?: string
          target_kind?: string | null
          target_path: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          kind?: string
          resolved?: boolean
          severity?: string
          target_kind?: string | null
          target_path?: string
        }
        Relationships: []
      }
      seo_audit_snapshot: {
        Row: {
          generated_at: string
          id: number
          payload: Json
        }
        Insert: {
          generated_at?: string
          id?: number
          payload?: Json
        }
        Update: {
          generated_at?: string
          id?: number
          payload?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wp_import_state: {
        Row: {
          content_kind: string
          imported_items: number
          last_error: string | null
          last_page: number
          status: string
          total_items: number | null
          total_pages: number | null
          updated_at: string
        }
        Insert: {
          content_kind: string
          imported_items?: number
          last_error?: string | null
          last_page?: number
          status?: string
          total_items?: number | null
          total_pages?: number | null
          updated_at?: string
        }
        Update: {
          content_kind?: string
          imported_items?: number
          last_error?: string | null
          last_page?: number
          status?: string
          total_items?: number | null
          total_pages?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      wp_media: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          description: string | null
          filesize: number | null
          height: number | null
          id: number
          imported_at: string | null
          media_date: string | null
          mime_type: string | null
          raw: Json
          slug: string | null
          source_url: string
          storage_path: string | null
          storage_url: string | null
          title: string | null
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          description?: string | null
          filesize?: number | null
          height?: number | null
          id: number
          imported_at?: string | null
          media_date?: string | null
          mime_type?: string | null
          raw?: Json
          slug?: string | null
          source_url: string
          storage_path?: string | null
          storage_url?: string | null
          title?: string | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          description?: string | null
          filesize?: number | null
          height?: number | null
          id?: number
          imported_at?: string | null
          media_date?: string | null
          mime_type?: string | null
          raw?: Json
          slug?: string | null
          source_url?: string
          storage_path?: string | null
          storage_url?: string | null
          title?: string | null
          updated_at?: string
          width?: number | null
        }
        Relationships: []
      }
      wp_post_outlines: {
        Row: {
          ai_notes: Json
          best_practices: Json
          citations: Json
          created_at: string
          examples: Json
          insights: Json
          narrative: Json
          quotes: Json
          risks: Json
          slug: string
          source_url: string | null
          stats: Json
          takeaways: Json
          title: string | null
          tools: Json
          updated_at: string
        }
        Insert: {
          ai_notes?: Json
          best_practices?: Json
          citations?: Json
          created_at?: string
          examples?: Json
          insights?: Json
          narrative?: Json
          quotes?: Json
          risks?: Json
          slug: string
          source_url?: string | null
          stats?: Json
          takeaways?: Json
          title?: string | null
          tools?: Json
          updated_at?: string
        }
        Update: {
          ai_notes?: Json
          best_practices?: Json
          citations?: Json
          created_at?: string
          examples?: Json
          insights?: Json
          narrative?: Json
          quotes?: Json
          risks?: Json
          slug?: string
          source_url?: string | null
          stats?: Json
          takeaways?: Json
          title?: string | null
          tools?: Json
          updated_at?: string
        }
        Relationships: []
      }
      wp_post_terms: {
        Row: {
          post_id: number
          taxonomy: string
          term_id: number
        }
        Insert: {
          post_id: number
          taxonomy: string
          term_id: number
        }
        Update: {
          post_id?: number
          taxonomy?: string
          term_id?: number
        }
        Relationships: []
      }
      wp_posts: {
        Row: {
          author_id: number | null
          content: string | null
          content_len: number | null
          created_at: string
          enrich_source: string | null
          enriched_at: string | null
          excerpt: string | null
          featured_media_id: number | null
          id: number
          imported_at: string
          menu_order: number | null
          meta: Json
          parent_id: number | null
          path: string | null
          permalink: string | null
          post_date: string | null
          post_modified: string | null
          post_type: string
          raw: Json
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          author_id?: number | null
          content?: string | null
          content_len?: number | null
          created_at?: string
          enrich_source?: string | null
          enriched_at?: string | null
          excerpt?: string | null
          featured_media_id?: number | null
          id: number
          imported_at?: string
          menu_order?: number | null
          meta?: Json
          parent_id?: number | null
          path?: string | null
          permalink?: string | null
          post_date?: string | null
          post_modified?: string | null
          post_type: string
          raw?: Json
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: number | null
          content?: string | null
          content_len?: number | null
          created_at?: string
          enrich_source?: string | null
          enriched_at?: string | null
          excerpt?: string | null
          featured_media_id?: number | null
          id?: number
          imported_at?: string
          menu_order?: number | null
          meta?: Json
          parent_id?: number | null
          path?: string | null
          permalink?: string | null
          post_date?: string | null
          post_modified?: string | null
          post_type?: string
          raw?: Json
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      wp_terms: {
        Row: {
          count: number | null
          created_at: string
          description: string | null
          id: number
          name: string | null
          parent_id: number | null
          raw: Json
          slug: string
          taxonomy: string
        }
        Insert: {
          count?: number | null
          created_at?: string
          description?: string | null
          id: number
          name?: string | null
          parent_id?: number | null
          raw?: Json
          slug: string
          taxonomy: string
        }
        Update: {
          count?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          parent_id?: number | null
          raw?: Json
          slug?: string
          taxonomy?: string
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
      refresh_content_stats: { Args: never; Returns: Json }
      run_seo_audit: { Args: never; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const

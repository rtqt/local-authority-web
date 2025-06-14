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
      categories: {
        Row: {
          category_id: string
          description: string | null
          name: string
        }
        Insert: {
          category_id?: string
          description?: string | null
          name: string
        }
        Update: {
          category_id?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      community_members: {
        Row: {
          first_name: string | null
          last_name: string | null
          phone_number: string | null
          preferred_language: string | null
          profile_image: string | null
          proof_of_address: string | null
          residential_address: string | null
          user_id: string
        }
        Insert: {
          first_name?: string | null
          last_name?: string | null
          phone_number?: string | null
          preferred_language?: string | null
          profile_image?: string | null
          proof_of_address?: string | null
          residential_address?: string | null
          user_id: string
        }
        Update: {
          first_name?: string | null
          last_name?: string | null
          phone_number?: string | null
          preferred_language?: string | null
          profile_image?: string | null
          proof_of_address?: string | null
          residential_address?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      feedback: {
        Row: {
          description: string | null
          feedback_id: string
          issue_id: string
          rating: number | null
          submission_date: string | null
          submitted_by_user_id: string | null
        }
        Insert: {
          description?: string | null
          feedback_id?: string
          issue_id: string
          rating?: number | null
          submission_date?: string | null
          submitted_by_user_id?: string | null
        }
        Update: {
          description?: string | null
          feedback_id?: string
          issue_id?: string
          rating?: number | null
          submission_date?: string | null
          submitted_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["issue_id"]
          },
          {
            foreignKeyName: "feedback_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      issues: {
        Row: {
          assigned_to_authority_id: string | null
          category_id: string
          description: string
          issue_id: string
          last_updated: string | null
          location_id: string | null
          resolution_date: string | null
          status: string | null
          submission_date: string | null
          submitted_by_user_id: string
          title: string
        }
        Insert: {
          assigned_to_authority_id?: string | null
          category_id: string
          description: string
          issue_id?: string
          last_updated?: string | null
          location_id?: string | null
          resolution_date?: string | null
          status?: string | null
          submission_date?: string | null
          submitted_by_user_id: string
          title: string
        }
        Update: {
          assigned_to_authority_id?: string | null
          category_id?: string
          description?: string
          issue_id?: string
          last_updated?: string | null
          location_id?: string | null
          resolution_date?: string | null
          status?: string | null
          submission_date?: string | null
          submitted_by_user_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_assigned_to_authority_id_fkey"
            columns: ["assigned_to_authority_id"]
            isOneToOne: false
            referencedRelation: "local_authorities"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "issues_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "issues_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "issues_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      local_authorities: {
        Row: {
          area_of_responsibility: string | null
          contact_email: string | null
          department: string
          user_id: string
        }
        Insert: {
          area_of_responsibility?: string | null
          contact_email?: string | null
          department: string
          user_id: string
        }
        Update: {
          area_of_responsibility?: string | null
          contact_email?: string | null
          department?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "local_authorities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      locations: {
        Row: {
          address_text: string | null
          city: string | null
          country: string | null
          latitude: number
          location_id: string
          longitude: number
          province: string | null
        }
        Insert: {
          address_text?: string | null
          city?: string | null
          country?: string | null
          latitude: number
          location_id?: string
          longitude: number
          province?: string | null
        }
        Update: {
          address_text?: string | null
          city?: string | null
          country?: string | null
          latitude?: number
          location_id?: string
          longitude?: number
          province?: string | null
        }
        Relationships: []
      }
      multimedia: {
        Row: {
          file_type: string
          file_url: string
          issue_id: string
          multimedia_id: string
          upload_date: string | null
        }
        Insert: {
          file_type: string
          file_url: string
          issue_id: string
          multimedia_id?: string
          upload_date?: string | null
        }
        Update: {
          file_type?: string
          file_url?: string
          issue_id?: string
          multimedia_id?: string
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "multimedia_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["issue_id"]
          },
        ]
      }
      system_administrators: {
        Row: {
          admin_level: string
          user_id: string
        }
        Insert: {
          admin_level: string
          user_id: string
        }
        Update: {
          admin_level?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_administrators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          is_active: boolean | null
          last_login_date: string | null
          last_name: string | null
          password_hash: string
          registration_date: string | null
          updated_at: string | null
          user_id: string
          user_role: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          is_active?: boolean | null
          last_login_date?: string | null
          last_name?: string | null
          password_hash: string
          registration_date?: string | null
          updated_at?: string | null
          user_id?: string
          user_role: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          is_active?: boolean | null
          last_login_date?: string | null
          last_name?: string | null
          password_hash?: string
          registration_date?: string | null
          updated_at?: string | null
          user_id?: string
          user_role?: string
          username?: string
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

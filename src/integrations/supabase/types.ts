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
      applications: {
        Row: {
          course_slug: string | null
          course_title: string | null
          created_at: string
          email: string
          experience: string | null
          id: string
          message: string | null
          name: string
          phone: string | null
          track: string | null
        }
        Insert: {
          course_slug?: string | null
          course_title?: string | null
          created_at?: string
          email: string
          experience?: string | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          track?: string | null
        }
        Update: {
          course_slug?: string | null
          course_title?: string | null
          created_at?: string
          email?: string
          experience?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          track?: string | null
        }
        Relationships: []
      }
      assignment_submissions: {
        Row: {
          course_slug: string
          feedback: string | null
          feedback_released: boolean
          file_name: string | null
          file_path: string | null
          grade: string | null
          id: string
          module_slug: string
          response: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          course_slug: string
          feedback?: string | null
          feedback_released?: boolean
          file_name?: string | null
          file_path?: string | null
          grade?: string | null
          id?: string
          module_slug: string
          response?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          course_slug?: string
          feedback?: string | null
          feedback_released?: boolean
          file_name?: string | null
          file_path?: string | null
          grade?: string | null
          id?: string
          module_slug?: string
          response?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          topic: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          topic: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          topic?: string
        }
        Relationships: []
      }
      course_instructors: {
        Row: {
          course_slug: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          course_slug: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          course_slug?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_instructors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          access_status: string
          application_id: string | null
          completed_at: string | null
          course_slug: string
          created_at: string
          enrolled_at: string | null
          enrollment_status: string
          id: string
          payment_status: string
          track: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_status?: string
          application_id?: string | null
          completed_at?: string | null
          course_slug: string
          created_at?: string
          enrolled_at?: string | null
          enrollment_status?: string
          id?: string
          payment_status?: string
          track?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_status?: string
          application_id?: string | null
          completed_at?: string | null
          course_slug?: string
          created_at?: string
          enrolled_at?: string | null
          enrollment_status?: string
          id?: string
          payment_status?: string
          track?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      module_content: {
        Row: {
          assignment: Json | null
          course_slug: string
          created_at: string
          duration: string | null
          id: string
          lesson: Json
          module_slug: string
          notes: Json | null
          published: boolean
          quiz: Json
          resources: Json
          summary: string | null
          title: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          assignment?: Json | null
          course_slug: string
          created_at?: string
          duration?: string | null
          id?: string
          lesson?: Json
          module_slug: string
          notes?: Json | null
          published?: boolean
          quiz?: Json
          resources?: Json
          summary?: string | null
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          assignment?: Json | null
          course_slug?: string
          created_at?: string
          duration?: string | null
          id?: string
          lesson?: Json
          module_slug?: string
          notes?: Json | null
          published?: boolean
          quiz?: Json
          resources?: Json
          summary?: string | null
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      module_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          course_slug: string
          id: string
          last_accessed: string | null
          module_slug: string
          score: number | null
          total: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          course_slug: string
          id?: string
          last_accessed?: string | null
          module_slug: string
          score?: number | null
          total?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          course_slug?: string
          id?: string
          last_accessed?: string | null
          module_slug?: string
          score?: number | null
          total?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          account_status?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          account_status?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          course_slug: string
          created_at: string
          id: string
          module_slug: string
          score: number
          total: number
          user_id: string
        }
        Insert: {
          answers?: Json
          course_slug: string
          created_at?: string
          id?: string
          module_slug: string
          score: number
          total: number
          user_id: string
        }
        Update: {
          answers?: Json
          course_slug?: string
          created_at?: string
          id?: string
          module_slug?: string
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_users: {
        Args: never
        Returns: {
          account_status: string
          created_at: string
          email: string
          email_verified: boolean
          full_name: string
          id: string
          last_sign_in_at: string
          provider: string
          roles: Json
        }[]
      }
      has_active_enrollment: {
        Args: { _course_slug: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_course_staff: {
        Args: { _course_slug: string; _user_id: string }
        Returns: boolean
      }
      my_access: { Args: never; Returns: Json }
      my_submissions: {
        Args: never
        Returns: {
          course_slug: string
          feedback: string
          file_name: string
          grade: string
          id: string
          module_slug: string
          response: string
          status: string
          submitted_at: string
        }[]
      }
      student_modules: {
        Args: never
        Returns: {
          assignment: Json
          course_slug: string
          duration: string
          lesson: Json
          module_slug: string
          notes: Json
          quiz: Json
          resources: Json
          summary: string
          title: string
        }[]
      }
      submit_module: {
        Args: {
          _answers: Json
          _course_slug: string
          _force?: boolean
          _module_slug: string
        }
        Returns: Json
      }
      touch_module: {
        Args: { _course_slug: string; _module_slug: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user" | "instructor"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user", "instructor"],
    },
  },
} as const

/**
 * Tipos generados desde el esquema de Supabase (supabase/migrations/).
 * Todo el esquema de la aplicacion vive en el schema `public`.
 *
 * Escritos a mano siguiendo el formato exacto de
 * `supabase gencode typescript` porque esta maquina no tiene Docker
 * instalado y no se ha podido levantar una instancia local para generarlos.
 * Regenerar en cuanto haya Docker disponible:
 *   npx supabase start
 *   npx supabase gencode typescript --local --schema public > src/types/dto/database.types.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13";
  };
  public: {
    Tables: {
      app_admins: {
        Relationships: [];
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          created_at?: string;
        };
      };
      projects: {
        Relationships: [];
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          problem: string | null;
          solution: string | null;
          technologies: string[];
          architecture: string | null;
          status: Database["public"]["Enums"]["project_status"];
          progress: number;
          github_url: string | null;
          demo_url: string | null;
          learnings: string | null;
          next_steps: string | null;
          is_published: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          problem?: string | null;
          solution?: string | null;
          technologies?: string[];
          architecture?: string | null;
          status?: Database["public"]["Enums"]["project_status"];
          progress?: number;
          github_url?: string | null;
          demo_url?: string | null;
          learnings?: string | null;
          next_steps?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          problem?: string | null;
          solution?: string | null;
          technologies?: string[];
          architecture?: string | null;
          status?: Database["public"]["Enums"]["project_status"];
          progress?: number;
          github_url?: string | null;
          demo_url?: string | null;
          learnings?: string | null;
          next_steps?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_screenshots: {
        Relationships: [];
        Row: {
          id: string;
          project_id: string;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_url: string;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          image_url?: string;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      garden_notes: {
        Relationships: [];
        Row: {
          id: string;
          slug: string;
          title: string;
          category: Database["public"]["Enums"]["garden_note_category"];
          status: Database["public"]["Enums"]["garden_note_status"];
          content: string | null;
          examples: string | null;
          commands: string | null;
          references_text: string | null;
          is_published: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          category: Database["public"]["Enums"]["garden_note_category"];
          status?: Database["public"]["Enums"]["garden_note_status"];
          content?: string | null;
          examples?: string | null;
          commands?: string | null;
          references_text?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          category?: Database["public"]["Enums"]["garden_note_category"];
          status?: Database["public"]["Enums"]["garden_note_status"];
          content?: string | null;
          examples?: string | null;
          commands?: string | null;
          references_text?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      garden_note_relations: {
        Relationships: [];
        Row: {
          note_id: string;
          related_note_id: string;
          created_at: string;
        };
        Insert: {
          note_id: string;
          related_note_id: string;
          created_at?: string;
        };
        Update: {
          note_id?: string;
          related_note_id?: string;
          created_at?: string;
        };
      };
      lab_experiments: {
        Relationships: [];
        Row: {
          id: string;
          lab_number: number;
          title: string;
          description: string | null;
          stack: string[];
          status: Database["public"]["Enums"]["lab_experiment_status"];
          github_url: string | null;
          demo_url: string | null;
          is_published: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          stack?: string[];
          status?: Database["public"]["Enums"]["lab_experiment_status"];
          github_url?: string | null;
          demo_url?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          stack?: string[];
          status?: Database["public"]["Enums"]["lab_experiment_status"];
          github_url?: string | null;
          demo_url?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      resources: {
        Relationships: [];
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: Database["public"]["Enums"]["resource_type"];
          url: string;
          is_published: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          type: Database["public"]["Enums"]["resource_type"];
          url: string;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          type?: Database["public"]["Enums"]["resource_type"];
          url?: string;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      now_items: {
        Relationships: [];
        Row: {
          id: string;
          category: Database["public"]["Enums"]["now_item_category"];
          title: string;
          description: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category: Database["public"]["Enums"]["now_item_category"];
          title: string;
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category?: Database["public"]["Enums"]["now_item_category"];
          title?: string;
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      stack_items: {
        Relationships: [];
        Row: {
          id: string;
          name: string;
          category: Database["public"]["Enums"]["stack_category"];
          usage_level: Database["public"]["Enums"]["stack_usage_level"];
          is_visible: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: Database["public"]["Enums"]["stack_category"];
          usage_level: Database["public"]["Enums"]["stack_usage_level"];
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: Database["public"]["Enums"]["stack_category"];
          usage_level?: Database["public"]["Enums"]["stack_usage_level"];
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      proposal_templates: {
        Relationships: [];
        Row: {
          id: string;
          name: string;
          summary: string | null;
          content: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          summary?: string | null;
          content: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          summary?: string | null;
          content?: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      financial_entries: {
        Relationships: [];
        Row: {
          id: string;
          type: Database["public"]["Enums"]["financial_entry_type"];
          amount: number;
          category: string | null;
          description: string;
          entry_date: string;
          lead_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: Database["public"]["Enums"]["financial_entry_type"];
          amount: number;
          category?: string | null;
          description: string;
          entry_date?: string;
          lead_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: Database["public"]["Enums"]["financial_entry_type"];
          amount?: number;
          category?: string | null;
          description?: string;
          entry_date?: string;
          lead_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_messages: {
        Relationships: [];
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          interest: string | null;
          is_read: boolean;
          pipeline_status: Database["public"]["Enums"]["lead_pipeline_status"];
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          interest?: string | null;
          is_read?: boolean;
          pipeline_status?: Database["public"]["Enums"]["lead_pipeline_status"];
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          interest?: string | null;
          is_read?: boolean;
          pipeline_status?: Database["public"]["Enums"]["lead_pipeline_status"];
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      project_status: "idea" | "en_desarrollo" | "beta" | "finalizado" | "paused";
      garden_note_status: "seed" | "growing" | "evergreen";
      garden_note_category: "sistemas" | "desarrollo" | "ia" | "ideas";
      resource_type:
        | "herramienta"
        | "libreria"
        | "curso"
        | "libro"
        | "repo"
        | "doc"
        | "prompt"
        | "snippet";
      lab_experiment_status: "experiment" | "working" | "archived";
      now_item_category: "building" | "learning" | "exploring";
      stack_category: "desarrollo" | "sistemas" | "infraestructura" | "ia";
      stack_usage_level: "daily" | "frequent" | "learning" | "exploring";
      lead_pipeline_status: "nuevo" | "contactado" | "propuesta_enviada" | "ganado" | "perdido";
      financial_entry_type: "ingreso" | "gasto";
    };
  };
};

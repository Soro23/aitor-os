/**
 * Tipos generados desde el esquema de Supabase (supabase/migrations/).
 * Todo el esquema de la aplicacion vive en el schema `asros` (no `public`).
 *
 * Escritos a mano siguiendo el formato exacto de
 * `supabase gencode typescript` porque esta maquina no tiene Docker
 * instalado y no se ha podido levantar una instancia local para generarlos.
 * Regenerar en cuanto haya Docker disponible:
 *   npx supabase start
 *   npx supabase gencode typescript --local --schema asros > src/types/dto/database.types.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
  asros: {
    Tables: {
      app_admins: {
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
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          problem: string | null;
          solution: string | null;
          technologies: string[];
          architecture: string | null;
          status: Database["asros"]["Enums"]["project_status"];
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
          status?: Database["asros"]["Enums"]["project_status"];
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
          status?: Database["asros"]["Enums"]["project_status"];
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
        Row: {
          id: string;
          slug: string;
          title: string;
          category: Database["asros"]["Enums"]["garden_note_category"];
          status: Database["asros"]["Enums"]["garden_note_status"];
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
          category: Database["asros"]["Enums"]["garden_note_category"];
          status?: Database["asros"]["Enums"]["garden_note_status"];
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
          category?: Database["asros"]["Enums"]["garden_note_category"];
          status?: Database["asros"]["Enums"]["garden_note_status"];
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
        Row: {
          id: string;
          lab_number: number;
          title: string;
          description: string | null;
          stack: string[];
          status: Database["asros"]["Enums"]["lab_experiment_status"];
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
          status?: Database["asros"]["Enums"]["lab_experiment_status"];
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
          status?: Database["asros"]["Enums"]["lab_experiment_status"];
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
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: Database["asros"]["Enums"]["resource_type"];
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
          type: Database["asros"]["Enums"]["resource_type"];
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
          type?: Database["asros"]["Enums"]["resource_type"];
          url?: string;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      now_items: {
        Row: {
          id: string;
          category: Database["asros"]["Enums"]["now_item_category"];
          title: string;
          description: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category: Database["asros"]["Enums"]["now_item_category"];
          title: string;
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category?: Database["asros"]["Enums"]["now_item_category"];
          title?: string;
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      stack_items: {
        Row: {
          id: string;
          name: string;
          category: Database["asros"]["Enums"]["stack_category"];
          usage_level: Database["asros"]["Enums"]["stack_usage_level"];
          is_visible: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: Database["asros"]["Enums"]["stack_category"];
          usage_level: Database["asros"]["Enums"]["stack_usage_level"];
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: Database["asros"]["Enums"]["stack_category"];
          usage_level?: Database["asros"]["Enums"]["stack_usage_level"];
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          interest: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          interest?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          interest?: string | null;
          is_read?: boolean;
          created_at?: string;
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
    };
  };
};

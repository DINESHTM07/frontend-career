/**
 * types/database.ts — Supabase Database Type Definitions
 *
 * Auto-generate this file by running:
 *   npx supabase gen types typescript --project-id <your-ref> > types/database.ts
 *
 * Manual placeholder below — replace with generated types once your schema exists.
 */

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          category: string;
          tags: string[];
          cover_image: string | null;
          author_id: string;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          reading_time: number;
          likes: number;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          category: string;
          tags?: string[];
          cover_image?: string | null;
          author_id: string;
          published?: boolean;
          published_at?: string | null;
          reading_time?: number;
          likes?: number;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
      };
      authors: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          avatar?: string | null;
          bio?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["authors"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

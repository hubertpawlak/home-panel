export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      push: {
        Row: {
          endpoint: string;
          p256dh: string;
          auth: string;
          ownerId: string;
          created_at: string;
        };
        Insert: {
          endpoint: string;
          p256dh: string;
          auth: string;
          ownerId: string;
          created_at?: string;
        };
        Update: {
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          ownerId?: string;
          created_at?: string;
        };
      };
      temperature_sensors: {
        Row: {
          hwId: string;
          temperature: number | null;
          resolution: number | null;
          name: string | null;
          updated_by: string | null;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          hwId: string;
          temperature?: number | null;
          resolution?: number | null;
          name?: string | null;
          updated_by?: string | null;
          updated_at?: string;
          created_at?: string;
        };
        Update: {
          hwId?: string;
          temperature?: number | null;
          resolution?: number | null;
          name?: string | null;
          updated_by?: string | null;
          updated_at?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

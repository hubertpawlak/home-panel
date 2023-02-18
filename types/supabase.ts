export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      push: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          owner_id: string
          p256dh: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          owner_id: string
          p256dh: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          owner_id?: string
          p256dh?: string
        }
      }
      temperature_sensors: {
        Row: {
          created_at: string
          hw_id: string
          name: string | null
          resolution: number | null
          temperature: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          hw_id: string
          name?: string | null
          resolution?: number | null
          temperature?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          hw_id?: string
          name?: string | null
          resolution?: number | null
          temperature?: number | null
          updated_at?: string
          updated_by?: string | null
        }
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

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
      uds_sensors: {
        Row: {
          created_at: string
          hardware_type: string
          id: string
          name: string
          resolution: number | null
          source_type: string
          temperature: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          hardware_type: string
          id: string
          name?: string
          resolution?: number | null
          source_type: string
          temperature?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          hardware_type?: string
          id?: string
          name?: string
          resolution?: number | null
          source_type?: string
          temperature?: number | null
          updated_at?: string
          updated_by?: string | null
        }
      }
      uds_upses: {
        Row: {
          battery_charge: number | null
          battery_charge_low: number | null
          battery_runtime: number | null
          battery_runtime_low: number | null
          created_at: string
          hardware_type: string
          id: string
          input_frequency: number | null
          input_voltage: number | null
          name: string
          output_frequency: number | null
          output_frequency_nominal: number | null
          output_voltage: number | null
          output_voltage_nominal: number | null
          source_type: string
          updated_at: string
          updated_by: string | null
          ups_load: number | null
          ups_power: number | null
          ups_power_nominal: number | null
          ups_realpower: number | null
          ups_status: string | null
        }
        Insert: {
          battery_charge?: number | null
          battery_charge_low?: number | null
          battery_runtime?: number | null
          battery_runtime_low?: number | null
          created_at?: string
          hardware_type: string
          id: string
          input_frequency?: number | null
          input_voltage?: number | null
          name?: string
          output_frequency?: number | null
          output_frequency_nominal?: number | null
          output_voltage?: number | null
          output_voltage_nominal?: number | null
          source_type: string
          updated_at?: string
          updated_by?: string | null
          ups_load?: number | null
          ups_power?: number | null
          ups_power_nominal?: number | null
          ups_realpower?: number | null
          ups_status?: string | null
        }
        Update: {
          battery_charge?: number | null
          battery_charge_low?: number | null
          battery_runtime?: number | null
          battery_runtime_low?: number | null
          created_at?: string
          hardware_type?: string
          id?: string
          input_frequency?: number | null
          input_voltage?: number | null
          name?: string
          output_frequency?: number | null
          output_frequency_nominal?: number | null
          output_voltage?: number | null
          output_voltage_nominal?: number | null
          source_type?: string
          updated_at?: string
          updated_by?: string | null
          ups_load?: number | null
          ups_power?: number | null
          ups_power_nominal?: number | null
          ups_realpower?: number | null
          ups_status?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_insecure_short_key: {
        Args: {
          size: number
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


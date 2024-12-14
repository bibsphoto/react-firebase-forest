export interface WebsitesSchema {
  Tables: {
    websitesSupervision: {
      Row: {
        created_at: string
        description: string | null
        id: number
        last_checked: string | null
        status: string | null
        url: string | null
        user_id: string | null
        icon_url: string | null
      }
      Insert: {
        created_at?: string
        description?: string | null
        id?: number
        last_checked?: string | null
        status?: string | null
        url?: string | null
        user_id?: string | null
        icon_url?: string | null
      }
      Update: {
        created_at?: string
        description?: string | null
        id?: number
        last_checked?: string | null
        status?: string | null
        url?: string | null
        user_id?: string | null
        icon_url?: string | null
      }
      Relationships: []
    }
    websitePingHistory: {
      Row: {
        checked_at: string | null
        created_at: string | null
        id: number
        response_time: number | null
        status: string
        website_id: number | null
      }
      Insert: {
        checked_at?: string | null
        created_at?: string | null
        id?: never
        response_time?: number | null
        status: string
        website_id?: number | null
      }
      Update: {
        checked_at?: string | null
        created_at?: string | null
        id?: never
        response_time?: number | null
        status?: string
        website_id?: number | null
      }
      Relationships: [
        {
          foreignKeyName: "websitePingHistory_website_id_fkey"
          columns: ["website_id"]
          isOneToOne: false
          referencedRelation: "websitesSupervision"
          referencedColumns: ["id"]
        }
      ]
    }
    website_positions: {
      Row: {
        created_at: string
        id: number
        position: number
        user_id: string
        website_id: number
      }
      Insert: {
        created_at?: string
        id?: number
        position: number
        user_id: string
        website_id: number
      }
      Update: {
        created_at?: string
        id?: number
        position?: number
        user_id?: string
        website_id?: number
      }
      Relationships: [
        {
          foreignKeyName: "website_positions_website_id_fkey"
          columns: ["website_id"]
          isOneToOne: false
          referencedRelation: "websitesSupervision"
          referencedColumns: ["id"]
        }
      ]
    }
  }
}
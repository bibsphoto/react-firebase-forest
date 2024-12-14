export interface WebsitesSchema {
  Tables: {
    websitesSupervision: {
      Row: {
        created_at: string;
        description: string | null;
        id: number;
        last_checked: string | null;
        status: string | null;
        url: string | null;
        user_id: string | null;
        icon_url: string | null;
        responseTime: number | null;
      };
      Insert: {
        created_at?: string;
        description?: string | null;
        id?: number;
        last_checked?: string | null;
        status?: string | null;
        url?: string | null;
        user_id?: string | null;
        icon_url?: string | null;
        responseTime?: number | null;
      };
      Update: {
        created_at?: string;
        description?: string | null;
        id?: number;
        last_checked?: string | null;
        status?: string | null;
        url?: string | null;
        user_id?: string | null;
        icon_url?: string | null;
        responseTime?: number | null;
      };
      Relationships: [];
    };
    websitePingHistory: {
      Row: {
        checked_at: string | null;
        created_at: string | null;
        id: number;
        response_time: number | null;
        status: string;
        website_id: number | null;
      };
      Insert: {
        checked_at?: string | null;
        created_at?: string | null;
        id?: never;
        response_time?: number | null;
        status: string;
        website_id?: number | null;
      };
      Update: {
        checked_at?: string | null;
        created_at?: string | null;
        id?: never;
        response_time?: number | null;
        status?: string;
        website_id?: number | null;
      };
      Relationships: [
        {
          foreignKeyName: "websitePingHistory_website_id_fkey";
          columns: ["website_id"];
          isOneToOne: false;
          referencedRelation: "websitesSupervision";
          referencedColumns: ["id"];
        }
      ];
    };
  };
}
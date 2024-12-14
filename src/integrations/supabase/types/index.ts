import { Json, Database } from './base';
import { WebsitesSchema } from './websites';

export type { Json, Database };

// Extend the base Database type with our WebsitesSchema
export type FullDatabase = Database & {
  public: Database['public'] & WebsitesSchema;
};

export * from './websites';
import { Json, Database } from './base';
import { WebsitesSchema } from './websites';

export type { Json, Database };

export type FullDatabase = Database & {
  public: Database['public'] & WebsitesSchema;
};

export * from './websites';
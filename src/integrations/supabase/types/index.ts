import { Database } from './base';
import { WebsitesSchema } from './websites';

export type { Database };

export type FullDatabase = Database & {
  public: Database['public'] & WebsitesSchema;
};

export * from './websites';
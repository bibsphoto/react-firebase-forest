import { AuthSchema } from './auth';
import { WebsitesSchema } from './websites';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: AuthSchema & WebsitesSchema;
};

export * from './auth';
export * from './websites';
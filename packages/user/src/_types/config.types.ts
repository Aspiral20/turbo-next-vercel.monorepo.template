import type { Metadata } from 'next';

export type ConfigType<ConfigChildrenType = any> = {
  server: ConfigChildrenType;
  local: ConfigChildrenType;
  production: ConfigChildrenType;
};

export type EnvsConfigType = {
  ENV: string;
  FRONT_URL: string;
  API_URL: string;
  NEXT_AUTH_SECRET?: string;
};

export type MetadataConfigType = {
  main: Metadata;
};

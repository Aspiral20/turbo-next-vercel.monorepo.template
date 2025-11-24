import type { Metadata } from 'next';
import { EnvironmentEnum } from "@/_types/node_env.types";
import { ConfigType } from "shared/src/_types/config.types";

export type EnvsConfigChildrenType = {
  ENV: string;
  FRONT_URL: string;
  API_URL: string;
  GITHUB_ID?: string;
  GITHUB_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  NEXT_AUTH_SECRET?: string;
};

export type MetadataConfigType = {
  main: Metadata;
};

export type LocalConfigType<ConfigChildrenType> = ConfigType<ConfigChildrenType, EnvironmentEnum>

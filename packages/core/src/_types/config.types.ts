import type { Metadata } from 'next';
import { EnvironmentEnum } from "@/_types/node_env.types";
import { ConfigType } from "shared/src/_types/config.types";
// import { DefaultCellMetadataConfigType } from '@/utils/helpers/i18n-seo';

export type EnvsConfigChildrenType = {
  ENV: string;
  FRONT_URL: string;
  API_URL: string;
  GITHUB_ID?: string;
  GITHUB_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  NEXT_AUTH_SECRET?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_SECURE?: string;
  SMTP_PASS?: string;
  SMTP_NOREPLY_USER?: string;
  SMTP_NOREPLY_FROM?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

export type MetadataConfigType = {
  /// Example:
  
  // main: DefaultCellMetadataConfigType;
  // blog: {
  //   self: DefaultCellMetadataConfigType;
  //   post: (post: BlogPostType, locale: string) => Metadata;
  // };
  // contact: DefaultCellMetadataConfigType;
  // faq: DefaultCellMetadataConfigType;
  // privacy: DefaultCellMetadataConfigType;
  // term: DefaultCellMetadataConfigType;
  // download: DefaultCellMetadataConfigType;
  // support: {
  //   self: DefaultCellMetadataConfigType;
  //   doc: (doc: SupportDocType, locale: string) => Metadata;
  // };
};

export type LocalConfigType<ConfigChildrenType> = ConfigType<ConfigChildrenType, EnvironmentEnum>

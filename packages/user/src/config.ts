import { ConfigType, EnvsConfigType, MetadataConfigType } from '@/_types/config.types';
import { NodeEnvEnum } from '@/_types/node_env.types';

export const PROJECT_NAME = {
  words: {
    first: 'user',
    second: '',
  },
};

const commonEnvs: Omit<EnvsConfigType, 'ENV'> = {
  FRONT_URL: process.env.NEXT_PUBLIC_FRONT_URL ?? 'NEXT_PUBLIC_FRONT_URL',
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'NEXT_PUBLIC_API_URL',
}

/**
 * Config
 **/
const envs: ConfigType<EnvsConfigType> = {
  /** Only server **/
  server: {
    ENV: process.env.NEXT_PUBLIC_NEXT_ENV ?? 'NEXT_PUBLIC_NEXT_ENV',
    ...commonEnvs,
    NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET ?? 'NEXT_AUTH_SECRET',
  },
  /** Only client **/
  local: {
    ENV: NodeEnvEnum.local,
    ...commonEnvs,
  },
  production: {
    ENV: NodeEnvEnum.production,
    ...commonEnvs,
  },
};

const localHostNames = ['localhost', '127.0.0.1', '192.168.0.8'];

const processConfig = (config: ConfigType) => {
  if (typeof window !== 'undefined') {
    const NEXT_PUBLIC_NEXT_ENV = process.env.NEXT_PUBLIC_NEXT_ENV;
    const { hostname } = window.location;
    if (NEXT_PUBLIC_NEXT_ENV === NodeEnvEnum.production) {
      return config.production;
    }
    if (localHostNames.indexOf(hostname) >= 0) {
      return config.local;
    }
  }

  return config.server;
};

const getConfig = () => processConfig(envs);

const config: EnvsConfigType = getConfig();

/**
 * Metadata
 **/
const mainTitle = `${PROJECT_NAME.words.first} ${PROJECT_NAME.words.second}`;

const description = `${mainTitle} description`;

const metadata: ConfigType<MetadataConfigType> = {
  server: {
    main: {
      title: `${mainTitle} ${config.ENV}`,
      description,
    },
  },
  local: {
    main: {
      title: `${mainTitle} ${config.ENV}`,
      description,
    },
  },
  production: {
    main: {
      title: `${mainTitle}`,
      description,
    },
  },
};

const getMetadata = () => {
  const NEXT_PUBLIC_NEXT_ENV = process.env.NEXT_PUBLIC_NEXT_ENV;
  if (NEXT_PUBLIC_NEXT_ENV === NodeEnvEnum.production) {
    return metadata.production;
  }

  return metadata.local;
};

const nextMetadata: MetadataConfigType = getMetadata();

export { config, nextMetadata };

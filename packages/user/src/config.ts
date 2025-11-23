import { EnvsConfigChildrenType, LocalConfigType, MetadataConfigType } from '@/_types/config.types';
import { EnvironmentEnum } from '@/_types/node_env.types';
import { localHostNames } from 'shared/src/utils/constants/local_host_names'

export const PROJECT_NAME = {
  words: {
    first: 'user',
    second: '',
  },
};

const commonEnvs: Omit<EnvsConfigChildrenType, 'ENV'> = {
  FRONT_URL: process.env.NEXT_PUBLIC_FRONT_URL ?? 'NEXT_PUBLIC_FRONT_URL',
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'NEXT_PUBLIC_API_URL',
}

/**
 * Config
 **/
const envs: LocalConfigType<EnvsConfigChildrenType> = {
  /** Only server **/
  server: {
    ENV: process.env.NEXT_PUBLIC_NEXT_ENV ?? 'NEXT_PUBLIC_NEXT_ENV',
    ...commonEnvs,
  },
  /** Only client **/
  local: {
    ENV: EnvironmentEnum.local,
    ...commonEnvs,
  },
  production: {
    ENV: EnvironmentEnum.production,
    ...commonEnvs,
  },
};

const processConfig = (config: LocalConfigType<EnvsConfigChildrenType>) => {
  if (typeof window !== 'undefined') {
    const NEXT_PUBLIC_NEXT_ENV = process.env.NEXT_PUBLIC_NEXT_ENV;
    const { hostname } = window.location;
    if (NEXT_PUBLIC_NEXT_ENV === EnvironmentEnum.production) {
      return config.production;
    }
    if (localHostNames.indexOf(hostname) >= 0) {
      return config.local;
    }
  }

  return config.server;
};

const getConfig = () => processConfig(envs);

const config: EnvsConfigChildrenType = getConfig();

/**
 * Metadata
 **/
const mainTitle = `${PROJECT_NAME.words.first} ${PROJECT_NAME.words.second}`;

const description = `${mainTitle} description`;

const metadata: LocalConfigType<MetadataConfigType> = {
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
  if (NEXT_PUBLIC_NEXT_ENV === EnvironmentEnum.production) {
    return metadata.production;
  }

  return metadata.local;
};

const nextMetadata: MetadataConfigType = getMetadata();

export { config, nextMetadata };

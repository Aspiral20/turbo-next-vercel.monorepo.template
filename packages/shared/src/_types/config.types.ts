import { ServerEnvironmentEnum } from "./node_env.types";

export type ConfigType<ConfigChildrenType, EnvironmentEnumType extends string | number | symbol> = Record<ServerEnvironmentEnum | EnvironmentEnumType, ConfigChildrenType>;

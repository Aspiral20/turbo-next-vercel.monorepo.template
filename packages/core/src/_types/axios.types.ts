import { AxiosInstance, AxiosRequestConfig } from 'axios';

export enum InstanceTypeEnum {
  extern = 'extern',
  intern = 'intern',
}

export enum InstancesEnum {
  axiosCryptocurrencyApi = 'axiosCryptocurrencyApi',
  axiosNextInstance = 'axiosNextInstance',
  axiosMainApiInstance = 'axiosMainApiInstance',
}

export type InstanceType = {
  name: InstancesEnum;
  instance: AxiosInstance;
};

export type InstanceInterceptorType = Record<string, InstanceType>;

export type InstancesType<TypeInstance = InstanceType> = {
  [InstanceTypeEnum.extern]: {
  };
  [InstanceTypeEnum.intern]: {
    axiosNextInstance: TypeInstance;
  };
} & Record<InstanceTypeEnum, Record<any, TypeInstance>>;

export type FetcherInstanceDataPropType = {
  instanceType: InstanceTypeEnum;
  instanceName: InstancesEnum;
};

export type ApiInterceptorDataType = AxiosRequestConfig & {
  externAccessKey?: string;
};

export type EndpointsType = InstancesType<any>;

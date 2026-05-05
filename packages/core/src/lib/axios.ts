import axios, { AxiosRequestConfig } from 'axios';
import { config } from '@/config';
import {
  ApiInterceptorDataType,
  EndpointsType,
  FetcherInstanceDataPropType,
  InstanceInterceptorType,
  InstancesEnum,
  InstancesType,
  InstanceTypeEnum,
} from '@/_types/axios.types';
// import { getSession } from 'next-auth/react';

const instances: InstancesType = {
  extern: {
  },
  intern: {
    axiosNextInstance: {
      name: InstancesEnum.axiosNextInstance,
      instance: axios.create({ baseURL: config.FRONT_URL + '/api' }),
    },
  },
};

/** Axios config */
const createInstanceInterceptors = (instances: InstanceInterceptorType) => {
  const instancesArr = Object.values(instances);

  for (const instanceType of instancesArr) {
    instances[instanceType.name].instance.interceptors.response.use(
      (res) => res,
      (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong'),
    );
  }
};

createInstanceInterceptors(instances.intern);
createInstanceInterceptors(instances.extern);

/** Add authorization for secured endpoints from session **/
// const withAuthApiConfig = async (data: {
//   withAuth: boolean;
//   externAccessKey?: string;
//   props?: AxiosRequestConfig;
// }): Promise<AxiosRequestConfig> => {
//   const { withAuth } = data;
//   const props = data.props ?? {};

//   let authorization;
//   if (data.externAccessKey) {
//     authorization = `Bearer ${data.externAccessKey}`;
//   } else {
//     const session = await getSession();
//     authorization = `Bearer ${session?.user?.access_token}`;
//   }

//   console.log(props);

//   return {
//     ...props,
//     headers: {
//       ...props?.headers,
//       Authorization: withAuth ? authorization : undefined,
//     },
//   };
// };

/** Used in "fetch" directory for getting data with SWR HOOKS */
export const swrFetcher = (
  instanceData: FetcherInstanceDataPropType = {
    instanceType: InstanceTypeEnum.intern,
    instanceName: InstancesEnum.axiosNextInstance,
  },
  withAuth = true,
) => {
  const { instanceType, instanceName } = instanceData;
  return async (args: string | [string, AxiosRequestConfig]) => {
    const [url, config] = Array.isArray(args) ? args : [args];

    const usedInstance = instances[instanceType][instanceName];

    if (usedInstance) {
      // const genConfig = await withAuthApiConfig({
      //   withAuth,
      //   props: config ? config : undefined,
      // });
      const res = await usedInstance?.instance.get(url, { ...config });

      return res.data;
    } else {
      throw new Error('Axios instance not found in fetcherIntern');
    }
  };
};

/** Used in "fetch" directory for getting data from extern with SWR HOOKS */
export const fetcherExtern = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Network response failed');
  }
  return res.json();
};

/** Used in "fetch" directory for getting data from extern, not in hooks */
export const apiInterceptor = (
  instanceData: FetcherInstanceDataPropType = {
    instanceType: InstanceTypeEnum.intern,
    instanceName: InstancesEnum.axiosNextInstance,
  },
  withAuth = true,
) => {
  const { instanceType, instanceName } = instanceData;
  const usedInstance = instances[instanceType][instanceName];

  if (usedInstance) {
    return {
      getApiData: async <DataType = any>(url: string, props?: ApiInterceptorDataType): Promise<DataType> => {
        // const genProps = await withAuthApiConfig({
        //   props,
        //   externAccessKey: props?.externAccessKey ? props?.externAccessKey : undefined,
        //   withAuth,
        // });
        const res = await usedInstance?.instance.get(url, props);

        return res.data;
      },
      postApiData: async <DataType = any>(
        url: string,
        body: any,
        props?: ApiInterceptorDataType,
      ): Promise<DataType> => {
        // const genProps = await withAuthApiConfig({
        //   props,
        //   externAccessKey: props?.externAccessKey ? props?.externAccessKey : undefined,
        //   withAuth,
        // });
        const res = await usedInstance?.instance.post(url, body, props);
        return res.data;
      },
      putApiData: async <DataType = any>(url: string, body: any, props?: ApiInterceptorDataType): Promise<DataType> => {
        // const genProps = await withAuthApiConfig({
        //   props,
        //   externAccessKey: props?.externAccessKey ? props?.externAccessKey : undefined,
        //   withAuth,
        // });
        const res = await usedInstance?.instance.put(url, body, props);
        return res.data;
      },
      deleteApiData: async <DataType = any>(url: string, props?: ApiInterceptorDataType): Promise<DataType> => {
        // const genProps = await withAuthApiConfig({
        //   props,
        //   externAccessKey: props?.externAccessKey ? props?.externAccessKey : undefined,
        //   withAuth,
        // });
        const res = await usedInstance?.instance.delete(url, props);
        return res.data;
      },
    };
  } else {
    throw new Error('Axios instance not found in apiInterceptor');
  }
};

/** Used in "fetch" directory
 *
 * proxmox.self => /api/proxmox/route
 *
 **/
const endpoints: EndpointsType = {
  extern: {
  },
  intern: {
    axiosNextInstance: {
      // info: {
      //   self: '/info',
      // },
    },
  },
};

export { instances, endpoints };

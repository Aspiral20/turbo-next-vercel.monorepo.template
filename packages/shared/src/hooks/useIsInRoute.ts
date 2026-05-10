import { InRouteType, IsInRouteParamsType } from "shared/src/_types/hooks/is_in_route.types";

/**
 * Ex.1.(routeType: 'string')
 * arr: [
 *   { routeType: 'string', route: '/'},
 *   { routeType: 'string', route: '/info'}
 * ]
 * pathname: '/info'
 *
 * Result: true
 * Ex.2.(routeType: 'regexp')
 * arr: [
 *   { routeType: 'regexp', route: new RegExp(/\/.+\/joint\/documents\/.+\/.+/) }
 * ]
 * pathname: '/sd4623-82d3-ae91f95259c1/joint/documents/pdf/sd.pdf'
 *
 * Result: true
 **/
const useIsInRoute = (arr: Array<InRouteType>, pathname: string, params?: IsInRouteParamsType) => {
  if (params?.include) {
    return arr.some((item) => item.routeType === 'string' && pathname.includes(item.route));
  }

  return arr.some((item) => {
    switch (item.routeType) {
      case 'string':
        return item.include ? pathname.includes(item.route) : pathname === item.route;
      case 'regexp':
        return item.route.test(pathname);
    }
  });
};

export default useIsInRoute;
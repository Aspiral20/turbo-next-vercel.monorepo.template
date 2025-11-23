export type InRouteType =
  | {
  routeType: 'string';
  route: string;
  include?: boolean;
}
  | {
  routeType: 'regexp';
  route: RegExp;
};

export type IsInRouteParamsType = {
  include?: boolean;
};
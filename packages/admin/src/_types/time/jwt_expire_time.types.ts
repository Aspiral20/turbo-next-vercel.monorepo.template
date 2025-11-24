import { MomentType } from "@/_types/time/moment.types";

/** Parameters for jwt format **/
type AuthJwtType = {
  string: string;
  number: number;
};

export type AuthExpireTimeType = {
  access: {
    format: {
      jwt: AuthJwtType;
      moment: MomentType;
    };
  };
  refresh: {
    format: {
      jwt: AuthJwtType;
      moment: MomentType;
    };
  };
};

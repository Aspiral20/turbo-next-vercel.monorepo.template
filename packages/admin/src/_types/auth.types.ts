import { UserType } from '@/_types/user.types';
import { MomentType } from '@/_types/time/moment.types';

export type SessionUserType = {
  id: UserType['id'];
  name: UserType['name'];
  email: UserType['email'];
  role: UserType['role'];
} | null;

export type JWTType = {
  id: UserType['id'];
  name: UserType['name'];
  email: UserType['email'];
  role: UserType['role'];
};

export type SessionType = {
  authenticated: boolean;
  user: SessionUserType;
};


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

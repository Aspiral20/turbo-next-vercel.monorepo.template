import { UserType } from '@/_types/user.types';

type ProviderType = {
  type: string;
  provider: string;
}

export type AdapterUserType = {
  id: string;
  email: string;
  emailVerified: Date | null
}

export type JWTType = {
  id: UserType['id'];
  name: UserType['name'];
  email: UserType['email'];
  role: UserType['role'];
  provider: ProviderType | null;
};

export type SessionUserType = Omit<JWTType, "provider">;

export type SessionType = {
  authenticated: boolean;
  provider: ProviderType | null;
  user: SessionUserType | null;
};

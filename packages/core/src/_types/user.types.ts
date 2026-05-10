export type UserType<OrType = string> = {
  id: string;
  email: string | OrType;
  role: (string & UserRolesEnum) | OrType;
  name: string | OrType;
  password: string | OrType;
  emailVerified?: boolean;
  emailVerifiedAt?: string | null;
  onboardingCompleted?: boolean;
  userType?: string;
  country?: string;
};

export enum UserRolesEnum {
  creator = 'creator',
  admin = 'admin',
  user = 'user',
}

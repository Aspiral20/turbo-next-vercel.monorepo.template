import { SessionType, JWTType } from '@/_types/auth.types';
// import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /** Session is used by next-auth in the background **/
  type Session = SessionType;
}

declare module 'next-auth/jwt' {
  // interface JWT extends DefaultJWT {
  /** JWT is used by next-auth in the background **/
  type JWT = JWTType;
}

import { SessionType, JWTType, AdapterUserType, SessionUserType } from '@/_types/auth.types';
// import { DefaultJWT, DefaultUser } from 'next-auth/jwt';
// import { AdapterUser } from "next-auth/src/adapters";
// import { User } from "next-auth/src/core/types";

declare module 'next-auth' {
  /** Session - used by next-auth for Session type. **/
  interface Session extends SessionType {}

  /**
   * The shape of the returned object in the OAuth providers' profile callback, available in the jwt and session callbacks, or the second parameter of the session callback, when using a database.
   * User - used by next-auth for "User" type.
   **/
  interface User extends SessionUserType {}
}

declare module 'next-auth/jwt' {
  /** JWT - used by next-auth for JWT type. DefaultJWT - by next-auth default **/
  interface JWT extends JWTType {}
}

declare module 'next-auth/adapters' {
  /** AdapterUser - used by next-auth for AdapterUser type. **/
  interface AdapterUser extends AdapterUserType {}
}

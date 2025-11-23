import { UserRolesEnum, UserType } from "@/_types/user.types";

export const users: Array<UserType> = [
  {
    id: "1",
    name: 'John Doe',
    email: 'verceluser@gmail.com',
    role: UserRolesEnum.admin,
    password: 'password',
  },
  {
    id: "2",
    name: 'Lucy Doe',
    email: 'lucydoe@gmail.com',
    role: UserRolesEnum.user,
    password: 'password',
  },
]
import { Role, UserStatus } from "../../generated/prisma/enums";

export interface IRequestUser {
  userId: string;
  role: Role;
  email: string;
  status?: UserStatus;
  isDeleted?: boolean;
}

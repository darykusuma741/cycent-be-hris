import { RoleEnum } from '@common/config/role.enum';

export class UserPayload {
  id!: number;
  roles!: RoleEnum[];
}

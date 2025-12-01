import { SetMetadata } from '@nestjs/common';
import { Roles } from '../enum/roles.enum';

export const ROLES_KEY = 'roles';
export const accessRoles = (...roles: (Roles | string)[]) =>
  SetMetadata(ROLES_KEY, roles);

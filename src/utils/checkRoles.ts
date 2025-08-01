import type { RolesEnum } from "../components/CreateAuthorizedUser/index.schema";
import { permissions } from "../constants/permissions";

export function checkPermissions(path: string, userRole: RolesEnum): boolean {
  const allowedRoles = permissions[path];
  return allowedRoles ? allowedRoles.includes(userRole) : true;
}

import { SetMetadata } from "@nestjs/common";
import { Role } from "../../user/enums/role.enum";

export const ROLES_KEY = 'roles';

// decorator/function to attach roles to the controller
export const Roles = (...roles: Role[]) => {
    return SetMetadata(ROLES_KEY, roles);
}
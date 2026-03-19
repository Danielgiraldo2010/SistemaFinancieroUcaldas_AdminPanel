export interface ResultError {
  code?: string;
  description?: string;
}

export interface Result {
  isSuccess?: boolean;
  isFailure?: boolean;
  succeeded?: boolean;
  error?: ResultError;
  errors?: ResultError[];
}

export interface BaseEntity {
  id?: string | number;
  createdAt?: string;
}

export interface PermissionDto extends BaseEntity {
  id?: number;
  name?: string;
  description?: string | null;
  module?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface CreatePermissionCommand {
  name?: string;
  description?: string | null;
  module?: string;
}

export interface UpdatePermissionCommand {
  permissionId?: number;
  name?: string;
  description?: string | null;
  module?: string;
  isActive?: boolean;
}

export interface AssignPermissionToRoleCommand {
  roleId?: string;
  permissionId?: number;
  assignedBy?: string | null;
}

export interface RemovePermissionFromRoleCommand {
  roleId?: string;
  permissionId?: number;
}

export interface RoleDto {
  id?: string;
  name?: string;
  normalizedName?: string | null;
  permissionCount?: number;
}

export interface CreateRoleCommand {
  name?: string;
}

export interface UpdateRoleCommand {
  roleId?: string;
  newName?: string;
}

export interface AssignRoleToUserCommand {
  userId?: string;
  roleName?: string;
}

export interface RemoveRoleFromUserCommand {
  userId?: string;
  roleName?: string;
}

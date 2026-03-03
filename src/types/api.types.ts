// Auto-generated types from swagger.json

export interface RegisterResponse {
  success?: boolean;
  userId?: string | null;
  message?: string | null;
  errors?: string[] | null;
}

export interface RegisterCommand {
  email?: string;
  password?: string;
  confirmPassword?: string;
  userName?: string | null;
  phoneNumber?: string | null;
}

export interface LoginResponse {
  success?: boolean;
  token?: string | null;
  refreshToken?: string | null;
  refreshTokenExpiry?: string | null;
  user?: UserDto | null;
  message?: string | null;
  errors?: string[] | null;
  requires2FA?: boolean;
}

export interface UserDto {
  id?: string;
  email?: string;
  userName?: string | null;
  phoneNumber?: string | null;
  twoFactorEnabled?: boolean;
  lastLoginDate?: string | null;
  lastLoginIp?: string | null;
}

export interface LoginCommand {
  email?: string;
  password?: string;
}

export interface ValidateTwoFactorResponse {
  success?: boolean;
  token?: string | null;
  refreshToken?: string | null;
  refreshTokenExpiry?: string | null;
  user?: UserDto | null;
  message?: string | null;
  errors?: string[] | null;
}

export interface ValidateTwoFactorCommand {
  code?: string;
  token?: string | null;
}

export interface Result {
  isSuccess?: boolean;
  isFailure?: boolean;
  succeeded?: boolean;
  error?: Error;
  errors?: Error[];
}

export interface Error {
  code?: string;
  description?: string;
}

export interface ForgotPasswordCommand {
  email?: string;
}

export interface ResetPasswordCommand {
  email?: string;
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface RefreshTokenCommand {
  refreshToken?: string;
}

export interface RevokeTokenCommand {
  refreshToken?: string;
  reason?: string;
}

export interface EnableTwoFactorCommand {
  email?: string;
  password?: string;
  enable?: boolean;
}

export interface AuditLogDto {
  id?: number;
  userId?: string | null;
  userEmail?: string | null;
  action?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  timestamp?: string;
  details?: string | null;
  status?: string | null;
  errorMessage?: string | null;
  resourceId?: string | null;
  resourceType?: string | null;
}

export interface PermissionDto {
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

export interface IpBlackListDto {
  id?: number;
  ipAddress?: string;
  reason?: string;
  isActive?: boolean;
  expiryDate?: string | null;
  createdAt?: string;
}

export interface BlockIpCommand {
  ipAddress?: string;
  reason?: string;
  blackListReason?: BlackListReason;
  expiryDate?: string | null;
  notes?: string | null;
}

export enum BlackListReason {
  ManualBlock = 0,
  TooManyAttempts = 1,
  SuspiciousActivity = 2,
  ReportedAbuse = 3,
}

export interface UnblockIpCommand {
  ipAddress?: string;
}

export interface UnlockAccountCommand {
  userId?: string;
}


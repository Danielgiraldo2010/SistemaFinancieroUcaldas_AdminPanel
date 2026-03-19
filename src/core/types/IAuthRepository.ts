import type {
  LoginCommand,
  LoginResponse,
  ValidateTwoFactorCommand,
  ValidateTwoFactorResponse,
  ForgotPasswordCommand,
  RegisterCommand,
  RegisterResponse,
  AuditLogDto,
} from './auth.types';

export interface IAuthRepository {
  login(data: LoginCommand): Promise<LoginResponse>;
  verify2fa(data: ValidateTwoFactorCommand): Promise<ValidateTwoFactorResponse>;
  forgotPassword(data: ForgotPasswordCommand): Promise<void>;
  register(data: RegisterCommand): Promise<RegisterResponse>;
  logout(): Promise<void>;
  getAuditLogs(params?: Record<string, unknown>): Promise<AuditLogDto[]>;
  getUserAuditLogs(userId: string, params?: Record<string, unknown>): Promise<AuditLogDto[]>;
}

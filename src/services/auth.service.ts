import { apiClient } from '@/lib';
import { endpoints } from '@/config';
import type {
  IAuthRepository,
  LoginCommand,
  LoginResponse,
  ValidateTwoFactorCommand,
  ValidateTwoFactorResponse,
  ForgotPasswordCommand,
  RegisterCommand,
  RegisterResponse,
  AuditLogDto,
} from '@/core';

class AuthService implements IAuthRepository {
  async login(data: LoginCommand): Promise<LoginResponse> {
    return apiClient.post(endpoints.auth.login, data);
  }

  async verify2fa(data: ValidateTwoFactorCommand): Promise<ValidateTwoFactorResponse> {
    return apiClient.post(endpoints.auth.verify2fa, data);
  }

  async forgotPassword(data: ForgotPasswordCommand): Promise<void> {
    return apiClient.post(endpoints.auth.forgotPassword, data);
  }

  async register(data: RegisterCommand): Promise<RegisterResponse> {
    return apiClient.post(endpoints.auth.register, data);
  }

  async logout(): Promise<void> {
    return apiClient.post(endpoints.auth.logout, {});
  }

  async getAuditLogs(params?: Record<string, unknown>): Promise<AuditLogDto[]> {
    return apiClient.get(endpoints.auth.auditLogs, params);
  }

  async getUserAuditLogs(userId: string, params?: Record<string, unknown>): Promise<AuditLogDto[]> {
    return apiClient.get(endpoints.auth.userAuditLogs(userId), params);
  }

  async enable2fa(data: { email: string; password: string; enable: boolean }): Promise<void> {
    return apiClient.post(endpoints.auth.enable2fa, data);
  }
}

export const authService = new AuthService();

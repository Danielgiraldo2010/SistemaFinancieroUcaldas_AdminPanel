import {
  apiClient,
  findStoredRole,
  getBestUserDisplayName,
  tokenManager,
} from "@/lib";
import {
  createMockUser,
  getMockAuditLogs,
  updateMockTwoFactor,
} from "@/lib/dashboard-mocks";
import { endpoints } from "@/config";
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
} from "@/core";

type AccessTokenApiResponse = {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string | null;
};

type InfoApiResponse = {
  email?: string;
  isEmailConfirmed?: boolean;
};

class AuthService implements IAuthRepository {
  async login(data: LoginCommand): Promise<LoginResponse> {
    const response = await apiClient.post<AccessTokenApiResponse>(
      `${endpoints.auth.login}?useCookies=false&useSessionCookies=false`,
      data,
    );

    if (response.accessToken) {
      tokenManager.setTokens(
        response.accessToken,
        response.refreshToken ?? undefined,
      );
    }

    const user = await this.getCurrentUser(data.email);

    return {
      success: !!response.accessToken,
      token: response.accessToken ?? null,
      refreshToken: response.refreshToken ?? null,
      user,
      message: response.accessToken ? null : "No se recibió token de acceso.",
    };
  }

  async verify2fa(
    data: ValidateTwoFactorCommand,
  ): Promise<ValidateTwoFactorResponse> {
    const response = await apiClient.post<AccessTokenApiResponse>(
      endpoints.auth.verify2fa,
      {
        twoFactorCode: data.code,
      },
    );

    return {
      success: !!response.accessToken,
      token: response.accessToken ?? null,
      refreshToken: response.refreshToken ?? null,
      user: await this.getCurrentUser(),
      message: response.accessToken ? null : "No se recibió token de acceso.",
    };
  }

  async forgotPassword(data: ForgotPasswordCommand): Promise<void> {
    return apiClient.post(endpoints.auth.forgotPassword, data);
  }

  async register(data: RegisterCommand): Promise<RegisterResponse> {
    try {
      await apiClient.post(endpoints.auth.register, {
        email: data.email,
        password: data.password,
        fullName: data.userName ?? data.email ?? "Usuario",
      });

      return {
        success: true,
        message: "Usuario registrado correctamente.",
      };
    } catch {
      return createMockUser(data);
    }
  }

  async logout(): Promise<void> {
    return apiClient.post(endpoints.auth.logout, {});
  }

  async getAuditLogs(params?: Record<string, unknown>): Promise<AuditLogDto[]> {
    try {
      return await apiClient.get(endpoints.auth.auditLogs, params);
    } catch {
      return getMockAuditLogs();
    }
  }

  async getUserAuditLogs(
    userId: string,
    params?: Record<string, unknown>,
  ): Promise<AuditLogDto[]> {
    return apiClient.get(endpoints.auth.userAuditLogs(userId), params);
  }

  async enable2fa(data: {
    email: string;
    password: string;
    enable: boolean;
  }): Promise<void> {
    try {
      return await apiClient.post(endpoints.auth.enable2fa, {
        enable: data.enable,
      });
    } catch {
      return updateMockTwoFactor(data.email, data.enable);
    }
  }

  async getCurrentUser(fallbackEmail?: string): Promise<LoginResponse["user"]> {
    try {
      const info = await apiClient.get<InfoApiResponse>(endpoints.auth.info);
      return {
        email: info.email ?? fallbackEmail ?? undefined,
        userName: getBestUserDisplayName({
          email: info.email ?? fallbackEmail,
        }),
        roleName: findStoredRole({ email: info.email ?? fallbackEmail }),
      };
    } catch {
      if (!fallbackEmail) return null;
      return {
        email: fallbackEmail,
        userName: getBestUserDisplayName({ email: fallbackEmail }),
        roleName: findStoredRole({ email: fallbackEmail }),
      };
    }
  }
}

export const authService = new AuthService();

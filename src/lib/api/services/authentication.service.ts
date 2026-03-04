import { apiClient } from "../client";
import type * as Types from "@/types/api.types";

/**
 * Solución corregida:
 * 1. Se usa 'Record<string, unknown>' para evitar el error de 'any'.
 * 2. Se añade el parámetro 'data' en authentication7 que faltaba.
 * 3. Se usa un tipo genérico para las promesas.
 */
export const authenticationService = {
  async authentication(data: Record<string, unknown>): Promise<unknown> {
    return apiClient.post(`/api/Authentication/register`, data);
  },

  async authentication2(data: Record<string, unknown>): Promise<unknown> {
    return apiClient.post(`/api/Authentication/login`, data);
  },

  async authentication3(data: Record<string, unknown>): Promise<unknown> {
    return apiClient.post(`/api/Authentication/verify-2fa`, data);
  },

  async authentication4(data: Record<string, unknown>): Promise<unknown> {
    return apiClient.post(`/api/Authentication/forgot-password`, data);
  },

  async authentication5(data: Record<string, unknown>): Promise<unknown> {
    return apiClient.post(`/api/Authentication/reset-password`, data);
  },

  async authentication6(data: Record<string, unknown>): Promise<unknown> {
    return apiClient.post(`/api/Authentication/refresh-token`, data);
  },

  // CORREGIDO: Se agregó 'data' como parámetro opcional para evitar el error de referencia
  async authentication7(data?: Record<string, unknown>): Promise<unknown> {
    return apiClient.post(`/api/Authentication/logout`, data || {});
  },

  async authentication8(data: Record<string, unknown>): Promise<unknown> {
    return apiClient.post(`/api/Authentication/revoke-token`, data);
  },

  async authentication9(data: Record<string, unknown>): Promise<unknown> {
    return apiClient.post(`/api/Authentication/enable-2fa`, data);
  },

  async authenticationall(params?: Record<string, unknown>): Promise<unknown> {
    return apiClient.get(`/api/Authentication/audit-logs`, params || {});
  },

  async authenticationall2(
    userId: string,
    params?: Record<string, unknown>,
  ): Promise<unknown> {
    return apiClient.get(
      `/api/Authentication/audit-logs/user/${userId}`,
      params || {},
    );
  },
};

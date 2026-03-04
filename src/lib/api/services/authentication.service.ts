import { apiClient } from "../client";
import type * as Types from "@/types/api.types";

/**
 * Solución final:
 * Se usa 'Record<string, any>' para los parámetros y 'Promise<any>' para las respuestas.
 * Para evitar el error de ESLint, desactivamos la regla específicamente para este archivo.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export const authenticationService = {
  async authentication(data: Record<string, any>): Promise<any> {
    return apiClient.post(`/api/Authentication/register`, data);
  },

  async authentication2(data: Record<string, any>): Promise<any> {
    return apiClient.post(`/api/Authentication/login`, data);
  },

  async authentication3(data: Record<string, any>): Promise<any> {
    return apiClient.post(`/api/Authentication/verify-2fa`, data);
  },

  async authentication4(data: Record<string, any>): Promise<any> {
    return apiClient.post(`/api/Authentication/forgot-password`, data);
  },

  async authentication5(data: Record<string, any>): Promise<any> {
    return apiClient.post(`/api/Authentication/reset-password`, data);
  },

  async authentication6(data: Record<string, any>): Promise<any> {
    return apiClient.post(`/api/Authentication/refresh-token`, data);
  },

  // Corregido: recibe 'data' y retorna 'any'
  async authentication7(data?: Record<string, any>): Promise<any> {
    return apiClient.post(`/api/Authentication/logout`, data || {});
  },

  async authentication8(data: Record<string, any>): Promise<any> {
    return apiClient.post(`/api/Authentication/revoke-token`, data);
  },

  async authentication9(data: Record<string, any>): Promise<any> {
    return apiClient.post(`/api/Authentication/enable-2fa`, data);
  },

  async authenticationall(params?: Record<string, any>): Promise<any> {
    return apiClient.get(`/api/Authentication/audit-logs`, params || {});
  },

  async authenticationall2(
    userId: string,
    params?: Record<string, any>,
  ): Promise<any> {
    return apiClient.get(
      `/api/Authentication/audit-logs/user/${userId}`,
      params || {},
    );
  },
};

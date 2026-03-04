/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../client";

/**
 * Servicio de Autenticación - Sistema Financiero Ucaldas
 * Se utiliza 'any' para compatibilidad con la estructura dinámica del API.
 */

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

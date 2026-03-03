import { apiClient } from '../client';
import type * as Types from '@/types/api.types';

export const securityService = {
  async securityall(params?: Record<string, any>): Promise<any> {
    return apiClient.get(`/api/Security/blocked-ips`, params || {});
  },
  async security(data: any): Promise<any> {
    return apiClient.post(`/api/Security/block-ip`, data);
  },
  async security2(data: any): Promise<any> {
    return apiClient.post(`/api/Security/unblock-ip`, data);
  },
  async security3(data: any): Promise<any> {
    return apiClient.post(`/api/Security/unlock-account`, data);
  },
};

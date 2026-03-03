import { apiClient } from '../client';
import type * as Types from '@/types/api.types';

export const permissionsService = {
  async permissionsall(params?: Record<string, any>): Promise<any> {
    return apiClient.get(`/api/Permissions`, params || {});
  },
  async permissionspost(data: any): Promise<any> {
    return apiClient.post(`/api/Permissions`, data);
  },
  async permissionsget(permissionId: string): Promise<any> {
    return apiClient.get(`/api/Permissions/${permissionId}`);
  },
  async permissionsput(permissionId: string, data: any): Promise<any> {
    return apiClient.put(`/api/Permissions/${permissionId}`, data);
  },
  async permissionsdelete(permissionId: string): Promise<any> {
    return apiClient.delete(`/api/Permissions/${permissionId}`);
  },
  async permissionsall2(roleId: string): Promise<any> {
    return apiClient.get(`/api/Permissions/role/${roleId}`);
  },
  async permissionspost2(data: any): Promise<any> {
    return apiClient.post(`/api/Permissions/assign`, data);
  },
  async permissionspost3(data: any): Promise<any> {
    return apiClient.post(`/api/Permissions/remove`, data);
  },
};

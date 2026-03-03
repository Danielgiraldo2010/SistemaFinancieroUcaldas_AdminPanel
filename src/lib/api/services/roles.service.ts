import { apiClient } from '../client';
import type * as Types from '@/types/api.types';

export const rolesService = {
  async rolesall(): Promise<any> {
    return apiClient.get(`/api/Roles`);
  },
  async rolespost(data: any): Promise<any> {
    return apiClient.post(`/api/Roles`, data);
  },
  async rolesget(roleId: string): Promise<any> {
    return apiClient.get(`/api/Roles/${roleId}`);
  },
  async rolesput(roleId: string, data: any): Promise<any> {
    return apiClient.put(`/api/Roles/${roleId}`, data);
  },
  async rolesdelete(roleId: string): Promise<any> {
    return apiClient.delete(`/api/Roles/${roleId}`);
  },
  async rolesall2(userId: string): Promise<any> {
    return apiClient.get(`/api/Roles/user/${userId}`);
  },
  async rolespost2(data: any): Promise<any> {
    return apiClient.post(`/api/Roles/assign`, data);
  },
  async rolespost3(data: any): Promise<any> {
    return apiClient.post(`/api/Roles/remove`, data);
  },
};

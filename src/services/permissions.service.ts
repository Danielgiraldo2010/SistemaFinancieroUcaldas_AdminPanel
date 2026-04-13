import { apiClient } from '@/lib';
import { createMockPermission, getMockPermissions } from '@/lib/dashboard-mocks';
import { endpoints } from '@/config';
import type {
  PermissionDto,
  CreatePermissionCommand,
  UpdatePermissionCommand,
  AssignPermissionToRoleCommand,
  RemovePermissionFromRoleCommand,
} from '@/core';

class PermissionsService {
  async getAll(params?: Record<string, unknown>): Promise<PermissionDto[]> {
    try {
      return await apiClient.get(endpoints.permissions.base, params);
    } catch {
      return getMockPermissions();
    }
  }

  async create(data: CreatePermissionCommand): Promise<PermissionDto> {
    try {
      return await apiClient.post(endpoints.permissions.base, data);
    } catch {
      return createMockPermission(data);
    }
  }

  async getById(id: number): Promise<PermissionDto> {
    return apiClient.get(endpoints.permissions.byId(id));
  }

  async update(id: number, data: UpdatePermissionCommand): Promise<void> {
    return apiClient.put(endpoints.permissions.byId(id), data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(endpoints.permissions.byId(id));
  }

  async getByRole(roleId: string): Promise<PermissionDto[]> {
    return apiClient.get(endpoints.permissions.byRole(roleId));
  }

  async assign(data: AssignPermissionToRoleCommand): Promise<void> {
    return apiClient.post(endpoints.permissions.assign, data);
  }

  async remove(data: RemovePermissionFromRoleCommand): Promise<void> {
    return apiClient.post(endpoints.permissions.remove, data);
  }
}

export const permissionsService = new PermissionsService();

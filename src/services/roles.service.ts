import { apiClient } from '@/lib';
import { createMockRole, deleteMockRole, getMockRoles } from '@/lib/dashboard-mocks';
import { endpoints } from '@/config';
import type {
  RoleDto,
  CreateRoleCommand,
  UpdateRoleCommand,
  AssignRoleToUserCommand,
  RemoveRoleFromUserCommand,
} from '@/core';

class RolesService {
  async getAll(): Promise<RoleDto[]> {
    try {
      return await apiClient.get(endpoints.roles.base);
    } catch {
      return getMockRoles();
    }
  }

  async create(data: CreateRoleCommand): Promise<RoleDto> {
    try {
      return await apiClient.post(endpoints.roles.base, data);
    } catch {
      return createMockRole(data.name);
    }
  }

  async getById(roleId: string): Promise<RoleDto> {
    return apiClient.get(endpoints.roles.byId(roleId));
  }

  async update(roleId: string, data: UpdateRoleCommand): Promise<void> {
    return apiClient.put(endpoints.roles.byId(roleId), data);
  }

  async delete(roleId: string): Promise<void> {
    try {
      return await apiClient.delete(endpoints.roles.byId(roleId));
    } catch {
      return deleteMockRole(roleId);
    }
  }

  async getByUser(userId: string): Promise<RoleDto[]> {
    return apiClient.get(endpoints.roles.byUser(userId));
  }

  async assign(data: AssignRoleToUserCommand): Promise<void> {
    return apiClient.post(endpoints.roles.assign, data);
  }

  async remove(data: RemoveRoleFromUserCommand): Promise<void> {
    return apiClient.post(endpoints.roles.remove, data);
  }
}

export const rolesService = new RolesService();

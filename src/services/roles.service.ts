import { apiClient } from '@/lib';
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
    return apiClient.get(endpoints.roles.base);
  }

  async create(data: CreateRoleCommand): Promise<RoleDto> {
    return apiClient.post(endpoints.roles.base, data);
  }

  async getById(roleId: string): Promise<RoleDto> {
    return apiClient.get(endpoints.roles.byId(roleId));
  }

  async update(roleId: string, data: UpdateRoleCommand): Promise<void> {
    return apiClient.put(endpoints.roles.byId(roleId), data);
  }

  async delete(roleId: string): Promise<void> {
    return apiClient.delete(endpoints.roles.byId(roleId));
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

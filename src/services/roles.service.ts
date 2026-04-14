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
      const data = await apiClient.get<unknown>(endpoints.roles.base);
      return this.normalizeRoles(data);
    } catch {
      return getMockRoles();
    }
  }

  async create(data: CreateRoleCommand): Promise<RoleDto> {
    try {
      const response = await apiClient.post<unknown>(endpoints.roles.base, data);
      return this.normalizeRole(response, data.name);
    } catch {
      return createMockRole(data.name);
    }
  }

  async getById(roleId: string): Promise<RoleDto> {
    const response = await apiClient.get<unknown>(endpoints.roles.byId(roleId));
    return this.normalizeRole(response, roleId);
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
    const data = await apiClient.get<unknown>(endpoints.roles.byUser(userId));
    return this.normalizeRoles(data);
  }

  async assign(data: AssignRoleToUserCommand): Promise<void> {
    return apiClient.post(endpoints.roles.assign(data.userId ?? ''), {
      roleName: data.roleName,
    });
  }

  async remove(data: RemoveRoleFromUserCommand): Promise<void> {
    return apiClient.post(endpoints.roles.remove, data);
  }

  async ensureRequiredRoles(requiredNames: string[]): Promise<RoleDto[]> {
    const existingRoles = await this.getAll();
    const existingNormalized = new Set(
      existingRoles
        .map((role) => role.normalizedName ?? role.name?.toUpperCase())
        .filter((value): value is string => !!value),
    );

    for (const roleName of requiredNames) {
      const normalized = roleName.toUpperCase();
      if (!existingNormalized.has(normalized)) {
        await this.create({ name: roleName });
        existingNormalized.add(normalized);
      }
    }

    return this.getAll();
  }

  private normalizeRoles(data: unknown): RoleDto[] {
    if (!Array.isArray(data)) return [];
    return data.map((item) => this.normalizeRole(item)).filter((role): role is RoleDto => !!role.name);
  }

  private normalizeRole(data: unknown, fallbackName?: string): RoleDto {
    if (typeof data === 'string') {
      return { id: data, name: data, normalizedName: data.toUpperCase(), permissionCount: 0 };
    }

    if (data && typeof data === 'object') {
      const role = data as Record<string, unknown>;
      const rawName =
        typeof role.name === 'string'
          ? role.name
          : typeof role.id === 'string'
            ? role.id
            : fallbackName;

      return {
        id: rawName,
        name: rawName,
        normalizedName:
          typeof role.normalizedName === 'string'
            ? role.normalizedName
            : rawName?.toUpperCase(),
        permissionCount:
          typeof role.permissionCount === 'number' ? role.permissionCount : 0,
      };
    }

    return {
      id: fallbackName,
      name: fallbackName,
      normalizedName: fallbackName?.toUpperCase(),
      permissionCount: 0,
    };
  }
}

export const rolesService = new RolesService();

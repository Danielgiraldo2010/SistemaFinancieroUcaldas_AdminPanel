import {
  apiClient,
  findStoredRole,
  getBestUserDisplayName,
  normalizeRoleName,
  removeStoredUserRole,
  removeStoredUserProfile,
  storeUserRole,
  storeUserProfile,
} from '@/lib';
import { endpoints } from '@/config';

type IdentityUserApiDto = {
  id?: string;
  userName?: string | null;
  email?: string;
  emailConfirmed?: boolean;
  phoneNumber?: string | null;
};

type CreateIdentityUserResponse = {
  id?: string;
  email?: string;
};

export type AdminIdentityUserDto = {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  rol: string | null;
  estado: 'Activo';
  createdAt: string;
  lastLogin: string | null;
  emailConfirmed: boolean;
};

export type CreateAdminIdentityUserInput = {
  email: string;
  password: string;
  fullName: string;
  roleName: string;
};

export type UpdateAdminIdentityUserRoleInput = {
  userId: string;
  email: string;
  fullName: string;
  roleName: string;
};

class UsersService {
  async getAll(): Promise<AdminIdentityUserDto[]> {
    const users = await apiClient.get<IdentityUserApiDto[]>(endpoints.users.base);

    return users.map((user) => {
      const id = user.id ?? user.email ?? crypto.randomUUID();
      const inferredRole = findStoredRole({ userId: id, email: user.email });

      return {
        id,
        userName: getBestUserDisplayName({
          userId: id,
          email: user.email,
          userName: user.userName,
        }),
        email: user.email || '',
        phoneNumber: user.phoneNumber ?? null,
        rol: inferredRole,
        estado: 'Activo',
        createdAt: '—',
        lastLogin: null,
        emailConfirmed: !!user.emailConfirmed,
      };
    });
  }

  async create(data: CreateAdminIdentityUserInput): Promise<AdminIdentityUserDto> {
    const created = await apiClient.post<CreateIdentityUserResponse>(endpoints.users.base, {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
    });

    const userId = created.id;
    if (!userId) {
      throw new Error('El backend no devolvió el id del usuario creado.');
    }

    storeUserProfile({
      userId,
      email: created.email ?? data.email,
      fullName: data.fullName,
    });
    await this.assignRole(userId, data.roleName);

    return {
      id: userId,
      userName: data.fullName,
      email: created.email ?? data.email,
      phoneNumber: null,
      rol: data.roleName,
      estado: 'Activo',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: null,
      emailConfirmed: true,
    };
  }

  async assignRole(userId: string, roleName: string): Promise<void> {
    const normalizedRoleName = normalizeRoleName(roleName) ?? roleName;
    try {
      await apiClient.post(endpoints.roles.assign(userId), {
        roleName: normalizedRoleName,
      });
    } catch (error) {
      const alreadyAssigned = this.isAlreadyAssignedRoleError(error, normalizedRoleName);
      if (!alreadyAssigned) throw error;
    }

    const users = await apiClient.get<IdentityUserApiDto[]>(endpoints.users.base);
    const user = users.find((item) => item.id === userId);
    storeUserRole({
      userId,
      email: user?.email,
      roleName: normalizedRoleName,
    });
  }

  async updateRole(data: UpdateAdminIdentityUserRoleInput): Promise<void> {
    await this.assignRole(data.userId, data.roleName);
    storeUserProfile({
      userId: data.userId,
      email: data.email,
      fullName: data.fullName,
    });
  }

  async delete(userId: string): Promise<void> {
    const users = await apiClient.get<IdentityUserApiDto[]>(endpoints.users.base);
    const user = users.find((item) => item.id === userId);
    await apiClient.delete(endpoints.users.byId(userId));
    removeStoredUserRole({ userId, email: user?.email });
    removeStoredUserProfile({ userId, email: user?.email });
  }

  private isAlreadyAssignedRoleError(error: unknown, roleName: string): boolean {
    if (!error || typeof error !== 'object') return false;

    const maybeAxiosError = error as {
      response?: {
        status?: number;
        data?: unknown;
      };
    };

    if (maybeAxiosError.response?.status !== 400) return false;

    const responseData = maybeAxiosError.response.data;
    if (!Array.isArray(responseData)) return false;

    return responseData.some(
      (item) =>
        typeof item === 'string' &&
        item.includes('User already in role') &&
        item.includes(roleName),
    );
  }
}

export const usersService = new UsersService();

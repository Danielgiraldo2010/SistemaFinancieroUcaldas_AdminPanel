import { apiClient } from '@/lib';
import {
  createMockBlockedIp,
  getMockBlockedIps,
  removeMockBlockedIp,
  unlockMockAccount,
} from '@/lib/dashboard-mocks';
import { endpoints } from '@/config';
import type {
  ISecurityRepository,
  IpBlackListDto,
  BlockIpCommand,
  UnblockIpCommand,
  UnlockAccountCommand,
} from '@/core';

class SecurityService implements ISecurityRepository {
  async getBlockedIps(params?: Record<string, unknown>): Promise<IpBlackListDto[]> {
    try {
      return await apiClient.get(endpoints.security.blockedIps, params);
    } catch {
      return getMockBlockedIps();
    }
  }

  async blockIp(data: BlockIpCommand): Promise<void> {
    try {
      return await apiClient.post(endpoints.security.blockIp, data);
    } catch {
      return createMockBlockedIp(data);
    }
  }

  async unblockIp(data: UnblockIpCommand): Promise<void> {
    try {
      return await apiClient.post(endpoints.security.unblockIp, data);
    } catch {
      return removeMockBlockedIp(data);
    }
  }

  async unlockAccount(data: UnlockAccountCommand): Promise<void> {
    try {
      return await apiClient.post(endpoints.security.unlockAccount, data);
    } catch {
      return unlockMockAccount(data);
    }
  }
}

export const securityService = new SecurityService();

import { apiClient } from '@/lib';
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
    return apiClient.get(endpoints.security.blockedIps, params);
  }

  async blockIp(data: BlockIpCommand): Promise<void> {
    return apiClient.post(endpoints.security.blockIp, data);
  }

  async unblockIp(data: UnblockIpCommand): Promise<void> {
    return apiClient.post(endpoints.security.unblockIp, data);
  }

  async unlockAccount(data: UnlockAccountCommand): Promise<void> {
    return apiClient.post(endpoints.security.unlockAccount, data);
  }
}

export const securityService = new SecurityService();

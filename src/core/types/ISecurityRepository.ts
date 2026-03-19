import type { IpBlackListDto, BlockIpCommand, UnblockIpCommand, UnlockAccountCommand } from './security.types';

export interface ISecurityRepository {
  getBlockedIps(params?: Record<string, unknown>): Promise<IpBlackListDto[]>;
  blockIp(data: BlockIpCommand): Promise<void>;
  unblockIp(data: UnblockIpCommand): Promise<void>;
  unlockAccount(data: UnlockAccountCommand): Promise<void>;
}

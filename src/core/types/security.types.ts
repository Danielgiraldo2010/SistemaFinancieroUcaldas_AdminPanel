export enum BlackListReason {
  ManualBlock = 0,
  TooManyAttempts = 1,
  SuspiciousActivity = 2,
  ReportedAbuse = 3,
}

export interface IpBlackListDto {
  id?: number;
  ipAddress?: string;
  reason?: string;
  isActive?: boolean;
  expiryDate?: string | null;
  createdAt?: string;
}

export interface BlockIpCommand {
  ipAddress?: string;
  reason?: string;
  blackListReason?: BlackListReason;
  expiryDate?: string | null;
  notes?: string | null;
}

export interface UnblockIpCommand {
  ipAddress?: string;
}

export interface UnlockAccountCommand {
  userId?: string;
}

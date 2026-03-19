export enum AuthStatus {
  Idle = 'idle',
  Loading = 'loading',
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
}

export enum TokenStatus {
  Valid = 'valid',
  Expired = 'expired',
  Missing = 'missing',
}

export { BlackListReason } from '../types/security.types';

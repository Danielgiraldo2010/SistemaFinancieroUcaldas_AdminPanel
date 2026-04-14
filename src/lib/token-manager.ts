import Cookies from 'js-cookie';
import { endpoints } from '@/config';

const REFRESH_THRESHOLD = Number(process.env.NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD) || 300000;
const SESSION_TIMEOUT = Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT) || 1800000;

class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private inactivityTimer: NodeJS.Timeout | null = null;

  getAccessToken() {
    return Cookies.get('access_token') ?? null;
  }

  getRefreshToken() {
    return Cookies.get('refresh_token') ?? null;
  }

  setTokens(accessToken: string, refreshToken?: string) {
    Cookies.set('access_token', accessToken, { expires: 1, secure: true, sameSite: 'strict' });
    if (refreshToken) {
      Cookies.set('refresh_token', refreshToken, { expires: 30, secure: true, sameSite: 'strict' });
    }
  }

  clearTokens() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }

  async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`/api/backend${endpoints.auth.refreshToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const data = await response.json();
      if (data?.accessToken && data?.refreshToken) {
        this.setTokens(data.accessToken, data.refreshToken);
        return true;
      }
    } catch {
      // refresh failed
    }
    return false;
  }

  startMonitoring() {
    const token = this.getAccessToken();
    if (!token) return;

    const decoded = this.decodeToken(token);
    if (decoded?.exp) {
      const timeUntilRefresh = decoded.exp * 1000 - Date.now() - REFRESH_THRESHOLD;
      if (timeUntilRefresh > 0) {
        this.refreshTimer = setTimeout(() => this.refreshAccessToken(), timeUntilRefresh);
      } else {
        this.refreshAccessToken();
      }
    }

    this.resetInactivityTimer();
    this.setupActivityListeners();
  }

  private resetInactivityTimer() {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => this.handleSessionExpired(), SESSION_TIMEOUT);
  }

  private setupActivityListeners() {
    if (typeof window === 'undefined') return;
    ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'].forEach((event) => {
      window.addEventListener(event, () => this.resetInactivityTimer(), { passive: true });
    });
  }

  private handleSessionExpired() {
    this.cleanup();
    this.clearTokens();
    if (typeof window !== 'undefined') window.location.href = '/login?session=expired';
  }

  private decodeToken(token: string): { exp: number } | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
    } catch {
      return null;
    }
  }

  cleanup() {
    if (this.refreshTimer) { clearTimeout(this.refreshTimer); this.refreshTimer = null; }
    if (this.inactivityTimer) { clearTimeout(this.inactivityTimer); this.inactivityTimer = null; }
  }
}

export const tokenManager = new TokenManager();

import Cookies from 'js-cookie';

const TOKEN_REFRESH_THRESHOLD = Number(process.env.NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD) || 300000; // 5 min
const SESSION_TIMEOUT = Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT) || 1800000; // 30 min

class TokenService {
  private refreshTimer: NodeJS.Timeout | null = null;
  private inactivityTimer: NodeJS.Timeout | null = null;
  private tokenExpiresAt: number | null = null;

  // Decodificar JWT para obtener tiempo de expiración
  private decodeToken(token: string): { exp: number } | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  // Iniciar monitoreo de token
  startTokenMonitoring() {
    const token = Cookies.get('access_token');
    if (!token) return;

    const decoded = this.decodeToken(token);
    if (decoded?.exp) {
      this.tokenExpiresAt = decoded.exp * 1000; // Convertir a milisegundos
      this.scheduleTokenRefresh();
    }

    this.startInactivityTimer();
    this.setupActivityListeners();
  }

  // Programar refresh del token
  private scheduleTokenRefresh() {
    if (!this.tokenExpiresAt) return;

    const now = Date.now();
    const timeUntilRefresh = this.tokenExpiresAt - now - TOKEN_REFRESH_THRESHOLD;

    if (timeUntilRefresh > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshToken();
      }, timeUntilRefresh);
    } else {
      // Token ya expiró o está por expirar
      this.refreshToken();
    }
  }

  // Refrescar token
  private async refreshToken() {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) {
        this.handleSessionExpired();
        return;
      }

      const response = await fetch('/api/proxy/api/Authentication/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        Cookies.set('access_token', data.token, { expires: 1 });
        if (data.refreshToken) {
          Cookies.set('refresh_token', data.refreshToken, { expires: 30 });
        }

        // Reiniciar monitoreo con el nuevo token
        this.startTokenMonitoring();
      } else {
        this.handleSessionExpired();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.handleSessionExpired();
    }
  }

  // Iniciar timer de inactividad
  private startInactivityTimer() {
    this.resetInactivityTimer();
  }

  // Resetear timer de inactividad
  private resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      this.handleSessionExpired();
    }, SESSION_TIMEOUT);
  }

  // Configurar listeners de actividad
  private setupActivityListeners() {
    if (typeof window === 'undefined') return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach((event) => {
      window.addEventListener(event, () => this.resetInactivityTimer(), { passive: true });
    });
  }

  // Manejar sesión expirada
  private handleSessionExpired() {
    this.cleanup();
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    localStorage.removeItem('user');
    
    if (typeof window !== 'undefined') {
      window.location.href = '/login?session=expired';
    }
  }

  // Limpiar timers
  cleanup() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }
}

export const tokenService = new TokenService();

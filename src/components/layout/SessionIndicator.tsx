'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export function SessionIndicator() {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateTimeLeft = () => {
      const token = Cookies.get('access_token');
      if (!token) {
        setTimeLeft('');
        return;
      }

      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        
        if (decoded.exp) {
          const expiresAt = decoded.exp * 1000;
          const now = Date.now();
          const diff = expiresAt - now;

          if (diff <= 0) {
            setTimeLeft('Expirado');
          } else {
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
          }
        }
      } catch {
        setTimeLeft('');
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '8px 12px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#6b7280',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 1000,
    }}>
      🕐 Sesión: {timeLeft}
    </div>
  );
}

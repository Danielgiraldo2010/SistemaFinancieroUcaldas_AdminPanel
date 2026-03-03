'use client';
import { useState } from 'react';
import { authenticationService } from '@/lib/api/services';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authenticationService.authentication4({ email });
      setSent(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        padding: '44px 40px',
        width: '100%',
        maxWidth: '440px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>📧</div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Correo enviado</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Si el email existe, recibirás instrucciones de recuperación.
        </p>
        <Link href="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
          ← Volver al login
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
      padding: '44px 40px',
      width: '100%',
      maxWidth: '440px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>🔑</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>Recuperar contraseña</h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Introduce tu email y te enviaremos instrucciones
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '15px',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '700',
            color: 'white',
            background: loading ? '#d1d5db' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Enviando...' : 'Enviar instrucciones'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href="/login" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
          ← Volver al login
        </Link>
      </div>
    </div>
  );
}

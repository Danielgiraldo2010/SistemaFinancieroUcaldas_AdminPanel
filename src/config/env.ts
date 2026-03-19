export const env = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

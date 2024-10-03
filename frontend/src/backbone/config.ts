export const config = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  serverAppOrigin: new URL(import.meta.env.VITE_SERVER_APP_ORIGIN),
  walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string,
} as const;

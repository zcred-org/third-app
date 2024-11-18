export const config = {
  landingHref: 'https://zcred.id',

  frameTime: 1_000 / 60,
  buildId: import.meta.env.VITE_BUILD_ID as string,
  isDev: /*import.meta.env.DEV ||*/ localStorage.getItem('isDev') === 'true'
    || new URLSearchParams(window.location.search).has('dev'),

  serverAppOrigin: new URL(import.meta.env.VITE_SERVER_APP_ORIGIN),
  walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string,
} as const;

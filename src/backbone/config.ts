export const config = {
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
  zCredFrontendUrl: new URL(import.meta.env.VITE_ZCRED_FRONTEND_URL),
  zCredStoreSecretDataRouteUrl: new URL(import.meta.env.VITE_ZCRED_STORE_SECRET_DATA_ROUTE_URL),
} as const;

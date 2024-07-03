import { CredHolder } from '@zcredjs/core';
import { config } from './config.ts';

export const credHolder = new CredHolder({
  credentialHolderURL: config.zCredFrontendUrl,
  userDataHolderURL: config.zCredStoreSecretDataRouteUrl,
});

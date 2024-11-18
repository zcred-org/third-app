import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import * as chains from 'wagmi/chains';
import { config } from './config.ts';


const metadata = {
  name: 'WineStore Demo',
  description: 'WineStore Demo',
  url: location.origin,
  icons: [new URL('favicon.svg', location.origin).href],
};

const allChains = Object.values(chains).filter((chain: unknown): chain is chains.Chain => {
  const isChain = typeof chain === 'object' && !!chain
    && 'id' in chain && 'name' in chain && 'nativeCurrency' in chain;
  if (!isChain) return false;
  const isTestnet = 'testnet' in chain && chain.testnet;
  return config.isDev || !isTestnet;
}) as unknown as [chains.Chain, ...chains.Chain[]];

export const wagmiConfig = defaultWagmiConfig({
  metadata, projectId: config.walletConnectProjectId,
  chains: allChains,
  auth: {
    socials: [],
    email: false,
    walletFeatures: false,
  },
});

export const web3modal = createWeb3Modal({
  metadata, projectId: config.walletConnectProjectId,
  wagmiConfig,
  allowUnsupportedChain: true,
  themeVariables: { '--w3m-border-radius-master': '1px' },
  themeMode: 'light',
});

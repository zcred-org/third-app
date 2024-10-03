import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import * as chains from 'wagmi/chains';
import { config } from './config.ts';


const projectId = '210e2cdbd47e9ccfd099225022759a11';
const metadata = {
  name: 'ThirdApp',
  description: 'ThirdApp website',
  url: location.origin,
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const allChains = Object.values(chains).filter((chain: unknown): chain is chains.Chain => {
  const isChain = typeof chain === 'object' && !!chain
    && 'id' in chain && 'name' in chain && 'nativeCurrency' in chain;
  if (!isChain) return false;
  const isTestnet = 'testnet' in chain && chain.testnet;
  return config.isDev || !isTestnet;
}) as unknown as [chains.Chain, ...chains.Chain[]];

export const wagmiConfig = defaultWagmiConfig({
  projectId, metadata,
  chains: allChains,
  auth: {
    socials: [],
    email: false,
    walletFeatures: false,
  },
});

export const web3modal = createWeb3Modal({
  projectId, metadata,
  wagmiConfig,
  allowUnsupportedChain: true,
  themeVariables: { '--w3m-border-radius-master': '1px' },
  themeMode: 'light',
});

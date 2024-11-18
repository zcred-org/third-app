import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { queryClient } from '@/backbone/query-client.ts';
import { wagmiConfig } from '@/backbone/wagmi-config.ts';
import { Background } from '@/compontents/Background/Background.tsx';
import { DemoCompletedModal } from '@/compontents/DemoCompletedModal.tsx';
import { Devtools } from '@/compontents/Devtools.tsx';
import { GlobalPreloader } from '@/compontents/GlobalPreloader.tsx';
import { HomePage } from '@/HomePage.tsx';
import '@/styles/var-dvh.ts';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>

        <HomePage />
        <DemoCompletedModal />
        <Background />

        <GlobalPreloader />
        <Devtools />

      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);

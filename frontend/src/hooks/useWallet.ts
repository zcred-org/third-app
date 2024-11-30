import { useQuery } from '@tanstack/react-query';
import { useWeb3ModalState, useWeb3Modal } from '@web3modal/wagmi/react';
import type { IWalletAdapter, Identifier } from '@zcredjs/core';
import { EIP1193Adapter } from '@zcredjs/ethereum';
import { useCallback, useMemo } from 'react';
import { useConnectorClient, useDisconnect, useAccount } from 'wagmi';
import type { OverrideProperties } from '@/types/override-properties.ts';
import { Ms } from '@/utils/ms.ts';


type UseWalletResultIdle = {
  connect: VoidFunction,
  disconnect: VoidFunction,
  isLoading: false,
  isConnected: false,
  error: null,
  adapter: null,
  address: null,
  chainId: null,
  subjectId: null,
}

type UseWalletResult = UseWalletResultIdle
  | OverrideProperties<UseWalletResultIdle, { isLoading: true }>
  | OverrideProperties<UseWalletResultIdle, { error: Error }>
  | OverrideProperties<UseWalletResultIdle, {
  isConnected: true,
  adapter: IWalletAdapter,
  address: string,
  chainId: string,
  subjectId: Identifier,
}>;

export function useWallet() {
  const account = useAccount();
  const web3Modal = useWeb3Modal();
  const disconnect = useDisconnect();
  const web3ModalState = useWeb3ModalState();
  const connector = useConnectorClient({ query: { throwOnError: false, retry: true } });
  const adapter = useMemo(() => {
    return connector.data && new EIP1193Adapter(connector.data) as IWalletAdapter;
  }, [connector.data]);

  const walletQuery = useQuery({
    queryKey: ['walletAdapter', `${connector.data?.chain.id}/${connector.data?.account.address}`],
    staleTime: Ms.day(),
    enabled: !!adapter,
    queryFn: async () => {
      if (!adapter) throw new Error('Wallet connection is not ready');
      const [address, chainId, subjectId] = await Promise.all([
        adapter.getAddress(), adapter.getChainId(), adapter.getSubjectId(),
      ]);
      return { address, subjectId, chainId };
    },
  });

  const isLoading = web3ModalState.open || connector.isFetching || walletQuery.isFetching || disconnect.isPending
    || account.isConnecting || account.isReconnecting;
  const isConnected = !isLoading && !!walletQuery.data?.subjectId;

  return {
    connect: useCallback(() => web3Modal.open(), [web3Modal]),
    disconnect: useCallback(() => disconnect.disconnect(), [disconnect]),
    error: connector.error || walletQuery.error || disconnect.error || null,
    isLoading,
    isConnected,
    adapter: isConnected && adapter || null,
    address: isConnected && walletQuery.data?.address || null,
    chainId: isConnected && walletQuery.data?.chainId || null,
    subjectId: isConnected && walletQuery.data?.subjectId || null,
  } as UseWalletResult;
}

import { useConnectorClient } from 'wagmi';
import { EIP1193Adapter } from '@zcredjs/ethereum';
import type { IWalletAdapter, Identifier } from '@zcredjs/core';
import { useQuery } from '@tanstack/react-query';
import { useWeb3ModalState, useWeb3Modal } from '@web3modal/wagmi/react';
import type { OverrideProperties } from '../types/override-properties.ts';


type UseWalletResultIdle = {
  connect: VoidFunction,
  isConnecting: false,
  isConnected: false,
  error: null,
  adapter: null,
  address: null,
  chainId: null,
  subjectId: null,
}

type UseWalletResult = UseWalletResultIdle
  | OverrideProperties<UseWalletResultIdle, { isConnecting: true }>
  | OverrideProperties<UseWalletResultIdle, { error: Error }>
  | OverrideProperties<UseWalletResultIdle, {
  isConnected: true,
  adapter: IWalletAdapter,
  address: string,
  chainId: string,
  subjectId: Identifier,
}>;

export function useWallet() {
  const web3Modal = useWeb3Modal();
  const web3ModalState = useWeb3ModalState();
  const connector = useConnectorClient({ query: { throwOnError: false, retry: true } });

  const walletQuery = useQuery({
    queryKey: ['walletAdapter', `${connector.data?.chain.id}/${connector.data?.account.address}`],
    enabled: !!connector.data?.account.address,
    queryFn: async () => {
      if (!connector.data) throw new Error('Connector is not ready');
      const adapter = new EIP1193Adapter(connector.data) as IWalletAdapter;
      const [address, chainId, subjectId] = await Promise.all([
        adapter.getAddress(), adapter.getChainId(), adapter.getSubjectId(),
      ]);
      return { adapter, address, subjectId, chainId };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isConnecting = web3ModalState.open || connector.isFetching || walletQuery.isFetching;
  const isConnected = !isConnecting && !!walletQuery.data?.subjectId;

  return {
    connect: () => web3Modal.open(),
    error: connector.error || walletQuery.error || null,
    isConnecting,
    isConnected,
    adapter: isConnected && walletQuery.data?.adapter || null,
    address: isConnected && walletQuery.data?.address || null,
    chainId: isConnected && walletQuery.data?.chainId || null,
    subjectId: isConnected && walletQuery.data?.subjectId || null,
  } as UseWalletResult;
}

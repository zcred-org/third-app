import { useQuery } from '@tanstack/react-query';
import { serverApp } from '@/backbone/server-app.ts';
import { useWallet } from '@/hooks/useWallet.ts';
import { Ms } from '@/utils/ms.ts';


export function useVerification() {
  const wallet = useWallet();

  const query = useQuery({
    queryKey: ['isVerified', wallet.subjectId],
    staleTime: Ms.minute(),
    enabled: wallet.isConnected,
    queryFn: async () => {
      if (!wallet.isConnected) throw new Error('Wallet is not connected');
      const isVerified = await serverApp.isVerified(wallet.subjectId) ?? false;
      const { verifyURL } = isVerified ? {} : await serverApp.startVerification(wallet.subjectId);
      return { isVerified, verifyURL };
    },
  });

  return {
    isFetching: query.isFetching,
    // optimistic value - if "true" in persisted cache - immediately return it, otherwise "undefined" until query resolved:
    isVerified: query.isFetching ? query.data?.isVerified || undefined : query.data?.isVerified,
    verifyURL: query.data?.verifyURL,
  };
}

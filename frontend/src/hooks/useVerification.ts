import { useQuery } from '@tanstack/react-query';
import { useWallet } from './useWallet.ts';
import { serverApp } from '../backbone/server-app.ts';


export function useVerification() {
  const wallet = useWallet();

  return useQuery({
    queryKey: ['isVerified', wallet?.subjectId],
    enabled: wallet.isConnected,
    queryFn: async () => {
      if (!wallet.isConnected) throw new Error('Wallet is not connected');
      const subjectId = wallet.subjectId;
      const isVerified = await serverApp.isVerified(subjectId);
      if (isVerified) {
        return { isVerified, subjectId };
      } else {
        const { verifyURL } = await serverApp.startVerification(subjectId);
        return { isVerified, verifyURL, subjectId };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

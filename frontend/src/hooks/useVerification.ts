import { useQuery } from '@tanstack/react-query';
import { serverApp } from '@/backbone/server-app.ts';
import { useWallet } from '@/hooks/useWallet.ts';
import { Ms } from '@/utils/ms.ts';


export function useVerification() {
  const wallet = useWallet();

  return useQuery({
    queryKey: ['isVerified', wallet?.subjectId],
    staleTime: Ms.minute(),
    gcTime: Ms.minute(),
    enabled: wallet.isConnected,
    queryFn: async () => {
      if (!wallet.isConnected) throw new Error('Wallet is not connected');
      const subjectId = wallet.subjectId;
      const isVerified = await serverApp.isVerified(subjectId) ?? false;
      if (isVerified) {
        return { isVerified, subjectId };
      } else {
        const { verifyURL } = await serverApp.startVerification(subjectId);
        return { isVerified, verifyURL, subjectId };
      }
    },
  });
}

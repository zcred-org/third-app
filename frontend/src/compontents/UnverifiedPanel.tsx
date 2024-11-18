import type { ComponentProps } from 'react';
import { ZCredButton } from '@/compontents/ZCredButton.tsx';
import { useVerification } from '@/hooks/useVerification.ts';
import { useWallet } from '@/hooks/useWallet.ts';
import { cn } from '@/utils/cn.ts';


export function UnverifiedPanel({ className, ...props }: ComponentProps<'div'>) {
  const wallet = useWallet();
  const verification = useVerification();
  const isUnconnected = !(wallet.isConnected || wallet.isLoading);

  return isUnconnected || verification.data?.isVerified === false ? (
    <div className={cn('flex flex-wrap items-center justify-center gap-1 xl:gap-3 py-3 px-5 bg-[#FFDBDB]', className)} {...props}>
        <span className="text-[#DD0000] text-center text-sm xl:text-base">
          To continue shopping you need prove
          <br className="xl:hidden" />
          that you are adult and not from USA
        </span>
      <ZCredButton className="text-sm xl:text-base" />
    </div>
  ) : null;
}

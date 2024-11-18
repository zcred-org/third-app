import { useReducer, useEffect, useCallback } from 'react';
import { Button, type ButtonProps } from '@/compontents/ui/Button.tsx';
import { IconZCred } from '@/compontents/ui/Icons/IconZCred.tsx';
import { useVerification } from '@/hooks/useVerification.ts';
import { useWallet } from '@/hooks/useWallet.ts';


// Prevent losing state on unmount
let isAutoRedirect = false;

export function ZCredButton(props: ButtonProps<'a'>) {
  const { onClick: _onClick, ..._props } = props;

  const [isRedirected, setRedirected] = useReducer(() => true, false);

  const wallet = useWallet();
  const verification = useVerification();

  const redirect = useCallback(() => {
    if (!verification.data?.verifyURL) return;
    window.location.assign(verification.data.verifyURL);
    setRedirected();
  }, [verification.data?.verifyURL]);

  useEffect(() => {
    if (isAutoRedirect && wallet.isConnected) redirect();
  }, [redirect, wallet.isConnected]);

  const onClick: NonNullable<ButtonProps<'a'>['onClick']> = (e) => {
    _onClick?.(e);
    if (wallet.isConnected) redirect();
    else {
      isAutoRedirect = true;
      wallet.connect();
    }
  };

  return (
    <Button
      as="a"
      href={verification.data?.verifyURL?.href}
      isLoading={verification.isFetching || isRedirected || wallet.isLoading}
      isApproximate={verification.isFetching || isRedirected}
      icon={<IconZCred className="size-5" />}
      onClick={onClick}
      {..._props}
    >Verify with zCred</Button>
  );
}

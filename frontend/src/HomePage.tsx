import { DemoCompletedModal } from '@/compontents/DemoCompletedModal.tsx';
import { Header } from '@/compontents/Header.tsx';
import { Button, type ButtonProps } from '@/compontents/ui/Button.tsx';
import { IconEthereum } from '@/compontents/ui/Icons/IconEthereum.tsx';
import { UnverifiedPanel } from '@/compontents/UnverifiedPanel.tsx';
import { useVerification } from '@/hooks/useVerification.ts';
import { useWallet } from '@/hooks/useWallet.ts';
import { cn } from '@/utils/cn.ts';


export function HomePage() {
  return (<>
    <Header />
    <UnverifiedPanel />
    <MainSection />
  </>);
}


function MainSection() {
  const wallet = useWallet();
  const verification = useVerification();
  const isVerified = verification.data?.isVerified;

  const wineClassName = 'h-full w-auto transition duration-1000 xl:h-[100%] xl:absolute xl:left-1/4 xl:-translate-x-1/2 xl:bottom-[-15%]';

  const buttonProps: ButtonProps<'a'> = !wallet.isConnected ? {
    children: (<>
      <IconEthereum className="size-7" />
      Connect Wallet
    </>),
    onClick: wallet.connect,
    isLoading: wallet.isLoading,
  } : isVerified === false ? {
    children: 'Verify with zCred',
    as: 'a',
    href: verification.data?.verifyURL?.href,
  } : {
    children: 'Add to Cart',
    onClick: DemoCompletedModal.open,
    isLoading: verification.isLoading,
  };

  return (
    <main className="flex flex-col gap-3 grow justify-center items-center pt-5 pb-10 xl:ml-[25%] xl:gap-14">
      <div className="grow h-0 w-auto min-h-[400px] relative xl:absolute xl:h-[unset] xl:inset-0 pointer-events-none">
        <img
          src="/images/bottle_from_with_korob_shadow.png" alt=""
          className={cn(wineClassName, isVerified ? 'opacity-100' : 'opacity-0')}
        />
        <img
          src="/images/korob_shadow.png" alt=""
          className={cn(wineClassName, 'ml-3 xl:ml-2 absolute top-0 xl:top-[unset] left-0', isVerified ? 'opacity-0 -translate-y-20' : 'opacity-100')}
        />
      </div>
      <h1 className="font-serif text-center text-2xl xl:text-5xl text-white font-bold">
        Château Lafite-Rothschild
        <br />
        2010
      </h1>
      <div className="flex gap-5 text-white">
        <WineProperty label="year" value="2010" />
        <WineProperty label="country" value="France" />
        <WineProperty label="alcohol" value="13% vol" />
      </div>
      <Button size="lg" isGlass isApproximate {...buttonProps} />
    </main>
  );
}


function WineProperty(props: { label: string, value: string }) {
  const isVerified = useVerification().data?.isVerified;

  return (
    <div className="flex flex-col">
      <span className="text-sm xl:text-lg">{props.label}</span>
      <span className="font-serif font-bold text-2xl xl:text-4xl ml-3">{isVerified ? props.value : '***'}</span>
    </div>
  );
}

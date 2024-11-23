import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useWalletInfo } from '@web3modal/wagmi/react';
import { Button } from '@/compontents/ui/Button.tsx';
import { IconDisconnect } from '@/compontents/ui/Icons/IconDisconnect.tsx';
import { IconEthereum } from '@/compontents/ui/Icons/IconEthereum.tsx';
import { IconUnverified } from '@/compontents/ui/Icons/IconUnverified.tsx';
import { IconVerified } from '@/compontents/ui/Icons/IconVerified.tsx';
import { Spinner } from '@/compontents/ui/Spinner/Spinner.tsx';
import { useVerification } from '@/hooks/useVerification.ts';
import { useWallet } from '../hooks/useWallet.ts';
import { addressShort } from '../utils/address-short.ts';


export function AccountButton() {
  const verification = useVerification();
  const { walletInfo } = useWalletInfo();
  const wallet = useWallet();

  if (!wallet.isConnected) return (
    <Button
      isGlass
      onClick={wallet.connect}
      isLoading={wallet.isLoading}
      icon={<IconEthereum className="size-5" />}
    >
      Connect Wallet
    </Button>
  );

  const walletIcon = walletInfo?.icon
    ? <img src={walletInfo.icon} alt="" className="size-5" />
    : null;

  return (
    <Menu>
      <MenuButton as={Button} isGlass className="flex gap-3 " icon={walletIcon}>
        {addressShort(wallet.address)}
      </MenuButton>
      <MenuItems
        anchor="bottom"
        transition
        className={`
          [--anchor-padding:1rem] [--anchor-gap:4px]
          flex flex-col items-center gap-1 px-2 py-2
          border border-white/30 bg-black/10 backdrop-blur-xl rounded-md
          origin-top transition ease-out data-[closed]:scale-90 data-[closed]:opacity-0
        `}
      >
        <MenuItem disabled>
          <div onClick={noAutoClose} className="flex flex-col text-white items-center">
            {verification.isFetching ? (<>
              <Spinner className="size-10" isApproximate />
              Verifying...
            </>) : verification.data?.isVerified ? (<>
              <IconVerified className="size-10 text-green-500 stroke-white stroke-[1.5] [paint-order:stroke]" />
              Verified
            </>) : (<>
              <IconUnverified className="size-10 text-orange-500 stroke-white stroke-[1.5] [paint-order:stroke]" />
              Unverified
            </>)}
          </div>
        </MenuItem>
        <MenuItem>
          <Button
            size="sm"
            className="w-full"
            isGlass isBlur={false}
            isLoading={wallet.isLoading}
            onClick={wallet.disconnect}
            icon={<IconDisconnect className="size-5" />}
          >Disconnect</Button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

function noAutoClose(event: never) {
  (event as MouseEvent)?.preventDefault?.();
}

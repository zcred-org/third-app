import { Transition } from '@headlessui/react';
import { IconUnverified } from '@/compontents/ui/Icons/IconUnverified.tsx';
import { useVerification } from '@/hooks/useVerification.ts';


export function UnverifiedPanel() {
  const verification = useVerification();

  return (
    <Transition show={!verification.data?.isVerified}>
      <div className={`
            group sticky top-0 overflow-hidden
            py-1 px-5 max-xl:w-full backdrop-blur-lg
            text-orange-100 bg-orange-400/30 border-b border-orange-300/30
            transition-all duration-300 data-[closed]:py-0 data-[closed]:opacity-0`}
      >
        <div className="flex items-center justify-center gap-3 text-base transition-all duration-300 group-data-[closed]:[line-height:0px]">
          <IconUnverified className="shrink-0 size-6 -mb-1 transition-all duration-300 group-data-[closed]:h-0" />
          To continue shopping you need prove that you are adult and not from USA
        </div>
      </div>
    </Transition>
  );
}

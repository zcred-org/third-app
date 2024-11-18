import { Transition } from '@headlessui/react';
import { AuroraBackground } from '@/compontents/ui/AuroraBackground.tsx';
import { Spinner } from '@/compontents/ui/Spinner/Spinner.tsx';
import { useIsAppLoading } from '@/hooks/useIsAppLoading.ts';


export function GlobalPreloader() {
  const isAppLoaded = useIsAppLoading();

  return (
    <Transition show={isAppLoaded}>
      <div className="fixed z-50 -inset-16 group transition duration-1000 blur-0 backdrop-blur-lg data-[closed]:backdrop-blur-0">
        <AuroraBackground
          className="fixed -inset-32 h-auto transition duration-1000 bg-red-900 group-data-[closed]:opacity-0 group-data-[closed]:blur-xl"
        >
          <Spinner isApproximate className="size-12 text-white/50" strokeWidth={1} />
        </AuroraBackground>
      </div>
    </Transition>
  );
}

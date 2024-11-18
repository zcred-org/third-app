import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';
import { config } from '@/backbone/config.ts';
import { Button } from '@/compontents/ui/Button.tsx';


export function DemoCompletedModal() {
  const [isOpen, setIsOpen] = useState(false);

  DemoCompletedModal.open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <Dialog
      open={isOpen}
      as="div"
      id="Dialog"
      transition
      className={`
        focus:outline-none fixed inset-0 p-4 duration-300 ease-in-out
        bg-black/70 backdrop-blur
        data-[closed]:bg-transparent data-[closed]:backdrop-blur-0
      `}
      onClose={close}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <DialogPanel
          transition
          className={`
            w-full max-w-md rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl duration-300 ease-in-out
            data-[closed]:scale-90 data-[closed]:opacity-0 data-[closed]:translate-y-[10px]
          `}
        >
          <DialogTitle as="h3" className="text-lg/7 font-medium text-white">
            Congratulations!
          </DialogTitle>
          <p className="mt-2 text-base/6 text-white/50">
            You have successfully passed the zCred verification demo for gaining
            access to third app services without disclosing your private attributes
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={close} isGlass>Got it, cool!</Button>
            <Button as='a' href={config.landingHref}>About zCred</Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

DemoCompletedModal.open = (): void => undefined;

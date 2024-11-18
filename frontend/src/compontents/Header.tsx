import { AccountButton } from '@/compontents/AccountButton.tsx';
import { useDevTools } from '@/hooks/useDevTools.ts';

export function Header() {
  const devtools = useDevTools();

  return (
    <header className="px-4 py-3 bg-black/20 backdrop-blur-xl">
      <div className="flex items-center justify-between container mx-auto">
        <div {...devtools.handlers} className='select-none'>
          <p className="text-2xl md:text-3xl text-white font-bold">WineStore</p>
        </div>
        <AccountButton />
      </div>
    </header>
  );
}

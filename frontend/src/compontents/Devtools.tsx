import { lazy, type ReactNode, Suspense } from 'react';
import { config } from '@/backbone/config.ts';


const ReactQueryDevtools = lazy(() => import('@tanstack/react-query-devtools/production')
  .then((res) => ({ default: res.ReactQueryDevtools })));

export function Devtools(): ReactNode {
  if (!config.isDev) return null;

  return (
    <Suspense fallback={null}>
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </Suspense>
  );
}

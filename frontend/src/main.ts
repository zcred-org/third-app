import { config } from '@/backbone/config.ts';


async function main() {
  try {
    if (config.isDev) {
      await import('eruda').then(({ default: eruda }) => eruda.init());
    }
  } finally {
    await import('@/App.tsx');
  }
}

main().catch(console.error);

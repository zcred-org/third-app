import { useRef, useMemo } from 'react';
import { config } from '@/backbone/config.ts';
import { Ms } from '@/utils/ms.ts';


export function useDevTools() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  const handlers = useMemo(() => {
    const onPressStart = () => {
      timeoutRef.current ??= setTimeout(devtoolsToggle, Ms.second(3));
    };
    const onPressEnd = () => {
      if (!timeoutRef.current) return;
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    };
    return {
      onMouseDown: onPressStart,
      onTouchStart: onPressStart,
      onMouseUp: onPressEnd,
      onTouchEnd: onPressEnd,
    };
  }, []);

  return {
    devtoolsToggle,
    handlers,
  };
}

function devtoolsToggle() {
  const isDevNext = !config.isDev;
  const url = new URL(window.location.href);

  if (isDevNext) localStorage.setItem('isDev', 'true');
  else {
    localStorage.removeItem('isDev');
    url.searchParams.delete('dev');
  }

  alert(`App will be reloaded with ${isDevNext ? 'DEV' : 'PROD'} mode`);
  window.location.replace(url.href);
}

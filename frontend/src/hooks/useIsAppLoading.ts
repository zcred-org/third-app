import { useState, useEffect, useReducer, useRef } from 'react';


export function useIsAppLoading() {
  const isNetworkActive = !useIsNetworkIdle();
  const [isLoadFired, setAppLoaded] = useReducer(() => false, true);
  const startAtMs = useRef(Date.now());

  useEffect(() => {
    const handleLoad = () => {
      const thresholdMs = Math.max(0, 100 - (Date.now() - startAtMs.current));
      setTimeout(setAppLoaded, thresholdMs);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return isLoadFired || isNetworkActive;
}


function useIsNetworkIdle(threshold = 500) {
  const [isNetworkIdle, setIsNetworkIdle] = useState(false);

  useEffect(() => {
    if (isNetworkIdle) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    let pendingRequests = 0;

    const observer = new PerformanceObserver((list) => list.getEntries().forEach((entry) => {
      if (entry.entryType === 'resource') {
        ++pendingRequests;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (pendingRequests === 0) setIsNetworkIdle(true);
        }, threshold);

        setTimeout(() => pendingRequests = Math.max(0, pendingRequests - 1), 0);
      }
    }));

    observer.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [isNetworkIdle, threshold]);

  console.log({ isNetworkIdle });

  return isNetworkIdle;
}

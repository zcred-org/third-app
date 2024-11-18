import { throttle } from '@/utils/throttle.ts';

/**
 * Backward compatibility for browsers that do not support CSS "dvh" unit.
 * A dvh unit works more correctly than vh especially on iOS devices.
 */
function updateVh() {
  const pixelCount = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--dvh', `${pixelCount}px`);
}

window.addEventListener('resize', throttle(updateVh, 100));
updateVh();

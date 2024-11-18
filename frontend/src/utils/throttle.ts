/**
 * Returned function:
 * - Fires immediately or after interval if time is not ended;
 * - Returns void.
 */
export function throttle<TArgs extends Array<unknown>>(
  func: (...args: TArgs) => unknown,
  ms = 100,
): VoidFunction {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let params: TArgs;
  let callAgain = false;

  return function (...args: TArgs) {
    params = args;
    if (timer === null) {
      func(...params);
      callAgain = false;
      timer = setTimeout(() => {
        if (callAgain) {
          func(...params);
          callAgain = false;
        }
        timer = null;
      }, ms);
    } else {
      params = args;
      callAgain = true;
    }
  };
}

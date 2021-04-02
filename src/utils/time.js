import { performance } from "perf_hooks";

/**
 * @typedef {{abort: Boolean}} Signal
 */

/**
 * @returns {Signal}
 */
export const createSignal = () => ({
  abort: false,
});

/**
 * @param {Number} ms
 * @param {Signal} [signal]
 */
export async function sleep(ms, signal) {
  const startTime = performance.now();
  return new Promise((resolve) => {
    const checkDone = () => {
      const now = performance.now();
      if ((signal && signal.abort) || now >= startTime + ms) {
        resolve();
        return;
      }
      setTimeout(checkDone, 100); // 100ms = time resolution
    };
    checkDone();
  });
}

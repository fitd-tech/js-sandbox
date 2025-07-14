export function getPerformanceDuration(callback, ...args) {
  const startTime = performance.now();
  const result = callback(...args);
  const endTime = performance.now();
  const duration = endTime - startTime;
  const roundedDuration = Math.round(duration * 100) / 100;
  return {
    result,
    duration: roundedDuration,
  };
}

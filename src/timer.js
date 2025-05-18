// src/timer.js
export function startCountdown(seconds, onTick, onComplete) {
  let remaining = seconds;
  const intervalId = setInterval(() => {
    remaining--;
    onTick(remaining);
    if (remaining <= 0) {
      clearInterval(intervalId);
      onComplete();
    }
  }, 1000);

  // Return a cancel function, so you can stop the timer early
  return () => clearInterval(intervalId);
}
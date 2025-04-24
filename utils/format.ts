export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatTimeMs(timeMs: number) {
  const seconds = Math.floor(timeMs / 1000);
  const milliseconds = Math.round(timeMs % 1000);
  return `${seconds}.${milliseconds.toString().padStart(3, "0")}`;
}

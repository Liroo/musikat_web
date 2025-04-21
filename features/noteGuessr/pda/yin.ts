export interface YinConfig {
  threshold: number;
  sampleRate: number;
}

const DEFAULT_YIN_PARAMS = {
  sampleRate: 44100,
  threshold: 0,
};

export function YIN(params: Partial<YinConfig> = {}) {
  const config: YinConfig = {
    ...DEFAULT_YIN_PARAMS,
    ...params,
  };
  const { sampleRate } = config;

  return function YINDetector(float32AudioBuffer: Float32Array): number | null {
    // Implements the ACF2+ algorithm
    let SIZE = float32AudioBuffer.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      const val = float32AudioBuffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.002)
      // not enough signal
      return -1;

    let r1 = 0,
      r2 = SIZE - 1;
    for (let i = 0; i < SIZE / 2; i++)
      if (Math.abs(float32AudioBuffer[i]) < config.threshold) {
        r1 = i;
        break;
      }
    for (let i = 1; i < SIZE / 2; i++)
      if (Math.abs(float32AudioBuffer[SIZE - i]) < config.threshold) {
        r2 = SIZE - i;
        break;
      }

    float32AudioBuffer = float32AudioBuffer.slice(r1, r2);
    SIZE = float32AudioBuffer.length;

    const c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++)
      for (let j = 0; j < SIZE - i; j++)
        c[i] = c[i] + float32AudioBuffer[j] * float32AudioBuffer[j + i];

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1,
      maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    const x1 = c[T0 - 1],
      x2 = c[T0],
      x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };
}

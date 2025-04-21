import micInput from "@/features/noteGuessr/pda/micInput";
import { noteFromPitch, noteName } from "@/features/noteGuessr/pda/utils";
import { YIN } from "@/features/noteGuessr/pda/yin";
import { useCallback, useRef, useState } from "react";

export default function NoteGuessr() {
  const rafId = useRef<number | null>(null);
  const yinRef = useRef<ReturnType<typeof YIN> | null>(null);
  const [frequency, setFrequency] = useState<number | null>(null);

  const raf = useCallback(() => {
    if (yinRef.current) {
      const analyser = micInput.getAnalyser();
      if (!analyser) return;

      const frequencyData = new Float32Array(analyser?.fftSize ?? 0);

      analyser.getFloatTimeDomainData(frequencyData);

      const pitch = yinRef.current(frequencyData);
      setFrequency(pitch);

      rafId.current = requestAnimationFrame(raf);
    }
  }, []);

  const onClick = async () => {
    if (micInput.getStream() === null) {
      await micInput.requestAudioInput();
      yinRef.current = YIN({
        sampleRate: micInput.getAudioContext()?.sampleRate ?? 44100,
      });

      rafId.current = requestAnimationFrame(raf);
    } else {
      micInput.cleanup();
    }
  };

  return (
    <div>
      <button onClick={onClick}>Press me</button>
      <p>{frequency}</p>
      <p>{noteFromPitch(frequency ?? 0)}</p>
      <p>{noteName(noteFromPitch(frequency ?? 0))}</p>
    </div>
  );
}

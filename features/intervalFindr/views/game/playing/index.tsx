import { IntervalFindr } from "@/features/intervalFindr/engine/useIntervalFindr";

export default function IntervalFindrPlaying({
  intervalFindr,
}: {
  intervalFindr: IntervalFindr;
}) {
  return (
    <div>
      <p>
        {intervalFindr.question.rootNote.name}
        {intervalFindr.question.rootNote.modifier}
      </p>
      <p>{intervalFindr.question.interval}</p>
      <p>{intervalFindr.question.direction}</p>
    </div>
  );
}

import { NoteGuessr } from "@/features/noteGuessr/engine/useNoteGuessr";
import NoteGuessrNoteToFind from "@/features/noteGuessr/views/game/playing/noteToFind";
import { useAppSelector } from "@/flux/hooks";
import { selectNoteGuessrAverageTimeByNote } from "@/flux/noteguessr/selector";
import useNotes from "@/hooks/useNote";
import { Note, noteToNoteId } from "@/types/note";
import { formatTime } from "@/utils/format";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function NoteGuessrPlaying({
  noteGuessr,
}: {
  noteGuessr: NoteGuessr;
}) {
  const t = useTranslations();
  const [timer, setTimer] = useState<number>(0);

  // Timer
  useEffect(() => {
    if (!noteGuessr.playing) return;
    if (!noteGuessr.startTime) return;
    const interval = setInterval(() => {
      if (noteGuessr.playing && noteGuessr.startTime) {
        const time = Math.floor((Date.now() - noteGuessr.startTime) / 1000);
        setTimer(time);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [noteGuessr.playing, noteGuessr.startTime]);

  const notes = useNotes([noteGuessr.note as Note]);

  const averageTime = useAppSelector(
    selectNoteGuessrAverageTimeByNote(noteToNoteId(noteGuessr.noteToFind))
  );

  return (
    <>
      {noteGuessr.noteToFind ? (
        <NoteGuessrNoteToFind noteToFind={noteGuessr.noteToFind} />
      ) : null}

      <div className="flex flex-col w-full">
        <div className="flex flex-col self-baseline">
          <p className="text-body2 text-grey-5">
            {t("features.noteGuessr.averageTime")}
          </p>
          <p className="text-[60px]">
            {averageTime === Infinity
              ? t("common.none")
              : formatTime(Math.round(averageTime / 1000))}
          </p>
        </div>
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col self-baseline">
            <p className="text-body2 text-grey-5">
              {t("features.noteGuessr.currentNote")}
            </p>
            <p className="text-[60px]">
              {notes[0] ? (
                <>
                  {notes[0].name}
                  {notes[0].modifier}
                </>
              ) : (
                t("common.none")
              )}
            </p>
          </div>
          <div className="flex flex-col self-baseline">
            <p className="text-body2 text-grey-5">
              {t("features.noteGuessr.time")}
            </p>
            <p className="text-[60px]">{formatTime(timer)}</p>
          </div>
        </div>
      </div>
    </>
  );
}

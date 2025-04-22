import { NoteGuessr } from "@/features/noteGuessr/engine/useNoteGuessr";
import NoteGuessrNoteToFind from "@/features/noteGuessr/noteToFind";
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

  return (
    <>
      {noteGuessr.stringToFind && noteGuessr.noteToFind ? (
        <NoteGuessrNoteToFind
          stringToFind={noteGuessr.stringToFind}
          noteToFind={noteGuessr.noteToFind}
        />
      ) : null}

      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col self-baseline">
          <p className="text-body2 text-grey-5">
            {t("features.noteGuessr.currentNote")}
          </p>
          <p className="text-[60px]">
            {noteGuessr.note ? (
              <>
                {t(`note.eu.${noteGuessr.note?.name}`)}
                {noteGuessr.note?.modifier}
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
    </>
  );
}

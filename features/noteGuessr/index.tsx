import UIButtonDepth from "@/components/ui/button/depth";
import useNoteGuessr from "@/features/noteGuessr/engine/useNoteGuessr";
import NoteGuessrNoteToFind from "@/features/noteGuessr/noteToFind";
import { formatTime } from "@/utils/format";
import { twMerge } from "@/utils/twMerge";
import { useEffect, useState } from "react";
import { useTranslations } from "use-intl";

export default function NoteGuessr() {
  const t = useTranslations();
  const [success, setSuccess] = useState(false);
  const noteGuessr = useNoteGuessr({
    onSuccess: () => {
      setSuccess(true);
    },
  });

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 1000);
    }
  }, [success]);

  const onClick = async () => {
    if (noteGuessr.playing) {
      noteGuessr.stop();
    } else {
      await noteGuessr.start();
    }
  };

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
    <div
      className={twMerge(
        "flex flex-col h-full w-full justify-center items-center transition-colors duration-150 relative",
        success ? "bg-primary" : "bg-secondary"
      )}
    >
      <div className="bg-white rounded-[16px] border border-black p-[40px] w-[400px]">
        <div className="relative z-10 flex flex-col gap-[40px] justify-center items-center">
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
            {noteGuessr.playing ? (
              <div className="flex flex-col self-baseline">
                <p className="text-body2 text-grey-5">
                  {t("features.noteGuessr.time")}
                </p>
                <p className="text-[60px]">{formatTime(timer)}</p>
              </div>
            ) : null}
          </div>

          <UIButtonDepth
            onClick={onClick}
            className={noteGuessr.playing ? "bg-secondary" : "bg-primary"}
          >
            <p>
              {noteGuessr.playing
                ? t("features.noteGuessr.stop")
                : t("features.noteGuessr.start")}
            </p>
          </UIButtonDepth>
        </div>
      </div>
    </div>
  );
}

import UIButtonDepth from "@/components/ui/button/depth";
import useNoteGuessr from "@/features/noteGuessr/engine/useNoteGuessr";
import NoteGuessrPlaying from "@/features/noteGuessr/playing";
import NoteGuessrSettings from "@/features/noteGuessr/settings";
import {
  GUITAR_STRING_NOTES,
  GuitarString,
  Note,
  SEMITONE_LIST,
} from "@/types/note";
import { twMerge } from "@/utils/twMerge";
import { useEffect, useState } from "react";
import { useTranslations } from "use-intl";

export default function NoteGuessr() {
  const t = useTranslations();
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState<{
    allowedStrings: GuitarString[];
    allowedSemitone: Note[];
  }>({
    allowedStrings: Object.keys(GUITAR_STRING_NOTES) as GuitarString[],
    allowedSemitone: SEMITONE_LIST,
  });

  const noteGuessr = useNoteGuessr({
    ...settings,
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

  return (
    <div
      className={twMerge(
        "flex flex-col h-full w-full justify-center items-center transition-colors duration-150 relative",
        success ? "bg-primary" : "bg-secondary"
      )}
    >
      <div className="bg-white rounded-[16px] border border-black p-[40px] w-[400px]">
        <div className="relative z-10 flex flex-col gap-[40px] justify-center items-center">
          {noteGuessr.playing ? (
            <NoteGuessrPlaying noteGuessr={noteGuessr} />
          ) : (
            <NoteGuessrSettings
              allowedStrings={settings.allowedStrings}
              allowedSemitone={settings.allowedSemitone}
              setSettings={setSettings}
            />
          )}

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

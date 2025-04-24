import UIButtonDepth from "@/components/ui/button/depth";
import useNoteGuessr from "@/features/noteGuessr/engine/useNoteGuessr";
import NoteGuessrPlaying from "@/features/noteGuessr/views/game/playing";
import NoteGuessrSettings from "@/features/noteGuessr/views/game/settings";
import { twMerge } from "@/utils/twMerge";
import Link from "next/link";
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
            <NoteGuessrSettings />
          )}

          <div className="flex flex-col justify-center items-center gap-[10px]">
            <Link href="/noteGuessr/stats">
              <p className="underline">
                {t("features.noteGuessr.stats.title")} →
              </p>
            </Link>

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
    </div>
  );
}

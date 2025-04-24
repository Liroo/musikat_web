import { useAppSelector } from "@/flux/hooks";
import { selectNoteGuessrAverageTimeAllNotes } from "@/flux/noteguessr/selector";
import { selectSettingsNotation } from "@/flux/settings/selector";
import { noteIdToNote } from "@/types/note";
import { formatTimeMs } from "@/utils/format";
import { twMerge } from "@/utils/twMerge";
import Link from "next/link";
import { useTranslations } from "use-intl";

export default function NoteGuessrStats() {
  const t = useTranslations();

  const averageTime = useAppSelector(selectNoteGuessrAverageTimeAllNotes);

  const settingsNotation = useAppSelector(selectSettingsNotation);
  console.log(averageTime);

  return (
    <div
      className={twMerge(
        "flex flex-col h-full w-full justify-center items-center transition-colors duration-150 relative bg-secondary"
      )}
    >
      <div className="bg-white rounded-[16px] border border-black p-[40px] w-[500px] max-h-[80dvh] overflow-y-scroll">
        <Link href="/">
          <div className="mb-[20px]">
            <p className="underline">← {t("common.back")}</p>
          </div>
        </Link>

        <div className="relative z-10 flex flex-col gap-[40px] justify-center items-center">
          <p className="text-body1">{t("features.noteGuessr.stats.title")}</p>

          <div className="flex flex-col w-full gap-[10px]">
            <div className="flex flex-row gap-[10px] justify-between w-full">
              <p className="text-subtitle2 underline flex-1">
                {t("features.noteGuessr.string")}
              </p>
              <p className="text-subtitle2 underline text-center flex-1">
                {t("features.noteGuessr.note")}
              </p>
              <p className="text-subtitle2 underline flex-1 text-right">
                {t("features.noteGuessr.averageTime")}
              </p>
            </div>

            <div className="flex flex-col gap-[6px] w-full">
              {averageTime.map((averageTimeNote) => {
                const note = noteIdToNote(averageTimeNote.noteId);

                return (
                  <div
                    key={averageTimeNote.noteId}
                    className="flex flex-row gap-[10px] justify-between"
                  >
                    <p className="text-body2 flex-1">
                      {t(`note.${settingsNotation}.${note.string}`)}
                    </p>
                    <p className="text-body2 flex-1 text-center">
                      {t(`note.${settingsNotation}.${note.name}`)}
                      {note.modifier}
                    </p>
                    <p className="text-body2 flex-1 text-right">
                      {isFinite(averageTimeNote.averageTime)
                        ? `${formatTimeMs(averageTimeNote.averageTime)}s`
                        : t("common.none")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

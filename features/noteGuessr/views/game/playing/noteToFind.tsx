import { useAppSelector } from "@/flux/hooks";
import { selectSettingsNotation } from "@/flux/settings/selector";
import useNotes from "@/hooks/useNote";
import { NoteWithOctaveAndString } from "@/types/note";
import { useTranslations } from "next-intl";

export default function NoteGuessrNoteToFind({
  noteToFind,
}: {
  noteToFind: NoteWithOctaveAndString;
}) {
  const t = useTranslations();

  const notes = useNotes([noteToFind]);
  const settingsNotation = useAppSelector(selectSettingsNotation);

  return (
    <div className="flex flex-col self-baseline">
      <div className="flex flex-col">
        <p className="text-body2 text-grey-5">
          {t("features.noteGuessr.string")}
        </p>
        <p className="text-[60px]">
          {t(`note.${settingsNotation}.${noteToFind.string}`)}{" "}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-body2 text-grey-5">
          {t("features.noteGuessr.note")}
        </p>
        <p className="text-[60px]">
          {notes[0]?.name}
          {notes[0]?.modifier}
        </p>
      </div>
    </div>
  );
}

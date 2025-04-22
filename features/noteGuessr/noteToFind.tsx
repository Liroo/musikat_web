import { GuitarString, Note } from "@/types/note";
import { useTranslations } from "next-intl";

export default function NoteGuessrNoteToFind({
  stringToFind,
  noteToFind,
}: {
  stringToFind: GuitarString;
  noteToFind: Note;
}) {
  const t = useTranslations();

  return (
    <div className="flex flex-col self-baseline">
      <div className="flex flex-col">
        <p className="text-body2 text-grey-5">
          {t("features.noteGuessr.string")}
        </p>
        <p className="text-[60px]">{t(`note.eu.${stringToFind}`)} </p>
      </div>
      <div className="flex flex-col">
        <p className="text-body2 text-grey-5">
          {t("features.noteGuessr.note")}
        </p>
        <p className="text-[60px]">
          {t(`note.eu.${noteToFind.name}`)}
          {noteToFind.modifier}
        </p>
      </div>
    </div>
  );
}

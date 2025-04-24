import { useAppSelector } from "@/flux/hooks";
import { selectSettingsNotation } from "@/flux/settings/selector";
import { Note, noteToNoteId } from "@/types/note";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function useNotes(notes: Note[]) {
  const notation = useAppSelector(selectSettingsNotation);
  const t = useTranslations();

  const notesTranslated = useMemo(() => {
    return notes.map((note) => {
      if (!note) return null;

      return {
        note,
        name: t(`note.${notation}.${note.name}`),
        modifier: note.modifier,
        id: noteToNoteId(note),
        octave: note.octave,
      };
    });
  }, [notes, t, notation]);

  return notesTranslated;
}

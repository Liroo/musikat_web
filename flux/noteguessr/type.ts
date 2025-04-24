import { GuitarString, Note } from "@/types/note";

export type NoteGuessrSettings = {
  msToMaintainNote: number;
  allowedStrings: GuitarString[];
  allowedSemitone: Note[];
};

import UIInputCheckbox from "@/components/ui/input/checkbox";
import { useAppDispatch, useAppSelector } from "@/flux/hooks";
import { noteGuessrSetSettings } from "@/flux/noteguessr/reducer";
import { selectNoteGuessrSettings } from "@/flux/noteguessr/selector";
import {
  GUITAR_STRING_NOTES,
  GuitarString,
  Note,
  SEMITONE_LIST,
} from "@/types/note";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

export default function NoteGuessrSettings() {
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const settings = useAppSelector(selectNoteGuessrSettings);
  const onChangeAllowedStrings = useCallback(
    (string: GuitarString, checked: boolean) => {
      const newAllowedStrings = [...settings.allowedStrings];
      if (checked) {
        newAllowedStrings.push(string);
      } else {
        newAllowedStrings.splice(newAllowedStrings.indexOf(string), 1);
      }
      dispatch(
        noteGuessrSetSettings({
          ...settings,
          allowedStrings: newAllowedStrings,
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.allowedStrings, settings.allowedSemitone]
  );

  const onChangeAllowedSemitone = useCallback(
    (semitone: Note, checked: boolean) => {
      const newAllowedSemitone = [...settings.allowedSemitone];
      if (checked) {
        newAllowedSemitone.push(semitone);
      } else {
        newAllowedSemitone.splice(newAllowedSemitone.indexOf(semitone), 1);
      }
      dispatch(
        noteGuessrSetSettings({
          ...settings,
          allowedSemitone: newAllowedSemitone,
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.allowedSemitone, settings.allowedStrings]
  );

  return (
    <div className="flex flex-1 flex-col gap-[10px] items-baseline self-stretch">
      <div className="flex flex-col gap-[10px]">
        <p className="text-body1">
          {t("features.noteGuessr.settings.allowedStrings")}
        </p>
        <div className="flex flex-row gap-[10px] items-center justify-center">
          {Object.keys(GUITAR_STRING_NOTES).map((string) => (
            <div className="flex flex-col gap-[2px] items-center" key={string}>
              <p className="text-body4 text-grey-5">{t(`note.eu.${string}`)}</p>
              <UIInputCheckbox
                key={string}
                checked={settings.allowedStrings.includes(
                  string as GuitarString
                )}
                onChange={(checked: boolean) => {
                  onChangeAllowedStrings(string as GuitarString, checked);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <p className="text-body1">
          {t("features.noteGuessr.settings.allowedSemitone")}
        </p>
        <div className="flex flex-row gap-[10px] items-center flex-wrap">
          {SEMITONE_LIST.map((semitone) => (
            <div
              className="flex flex-col gap-[2px] items-center justify-center"
              key={semitone.name + semitone.modifier}
            >
              <p className="text-body4 text-grey-5">
                {t(`note.eu.${semitone.name}`)}
                {semitone.modifier}
              </p>
              <UIInputCheckbox
                key={semitone.name}
                checked={settings.allowedSemitone.some(
                  (allowedNote) =>
                    allowedNote.name === semitone.name &&
                    allowedNote.modifier === semitone.modifier
                )}
                onChange={(checked: boolean) => {
                  const newAllowedSemitone = [...settings.allowedSemitone];
                  if (checked) {
                    newAllowedSemitone.push(semitone);
                  } else {
                    newAllowedSemitone.splice(
                      newAllowedSemitone.indexOf(semitone),
                      1
                    );
                  }
                  onChangeAllowedSemitone(semitone, checked);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

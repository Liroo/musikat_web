import UIInputCheckbox from "@/components/ui/input/checkbox";
import {
  GUITAR_STRING_NOTES,
  GuitarString,
  Note,
  SEMITONE_LIST,
} from "@/types/note";
import { useTranslations } from "next-intl";

export default function NoteGuessrSettings({
  allowedStrings,
  allowedSemitone,
  setSettings,
}: {
  allowedStrings: GuitarString[];
  allowedSemitone: Note[];
  setSettings: (settings: {
    allowedStrings: GuitarString[];
    allowedSemitone: Note[];
  }) => void;
}) {
  const t = useTranslations();

  return (
    <div className="flex flex-1 flex-col gap-[30px] items-baseline self-stretch">
      <div className="flex flex-col gap-[10px]">
        <p className="text-body1">
          {t("features.noteGuessr.settings.allowedStrings")}
        </p>
        <div className="flex flex-row gap-[10px] items-center justify-center">
          {Object.keys(GUITAR_STRING_NOTES).map((string, index) => (
            <div className="flex flex-col gap-[2px] items-center" key={string}>
              <p className="text-body4 text-grey-5">{t(`note.eu.${string}`)}</p>
              <UIInputCheckbox
                key={string}
                checked={allowedStrings.includes(string as GuitarString)}
                onChange={(checked: boolean) => {
                  const newAllowedStrings = [...allowedStrings];
                  if (checked) {
                    newAllowedStrings.push(string as GuitarString);
                  } else {
                    newAllowedStrings.splice(
                      newAllowedStrings.indexOf(string as GuitarString),
                      1
                    );
                  }
                  setSettings({
                    allowedStrings: newAllowedStrings,
                    allowedSemitone: allowedSemitone,
                  });
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
          {SEMITONE_LIST.map((semitone, index) => (
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
                checked={allowedSemitone.some(
                  (allowedNote) =>
                    allowedNote.name === semitone.name &&
                    allowedNote.modifier === semitone.modifier
                )}
                onChange={(checked: boolean) => {
                  const newAllowedSemitone = [...allowedSemitone];
                  if (checked) {
                    newAllowedSemitone.push(semitone);
                  } else {
                    newAllowedSemitone.splice(
                      newAllowedSemitone.indexOf(semitone),
                      1
                    );
                  }
                  setSettings({
                    allowedStrings: allowedStrings,
                    allowedSemitone: newAllowedSemitone,
                  });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

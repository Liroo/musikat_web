import UIButton from "@/components/ui/button";
import { IntervalFindr } from "@/features/intervalFindr/engine/useIntervalFindr";
import { useAppSelector } from "@/flux/hooks";
import { selectSettingsNotation } from "@/flux/settings/selector";
import { applyIntervalToNote } from "@/types/interval";
import {
  NOTE_LETTERS,
  NOTE_MODIFIERS,
  NoteModifier,
  NoteName,
} from "@/types/note";
import { twMerge } from "@/utils/twMerge";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export default function IntervalFindrPlaying({
  intervalFindr,
  success,
  failure,
}: {
  intervalFindr: IntervalFindr;
  success: boolean;
  failure: boolean;
}) {
  const t = useTranslations();
  const settingsNotation = useAppSelector(selectSettingsNotation);

  const [selectedNoteLetter, setSelectedNoteLetter] = useState<NoteName | null>(
    null
  );
  const [selectedNoteModifier, setSelectedNoteModifier] =
    useState<NoteModifier | null>(null);

  const onSelectNoteLetter = (letter: NoteName) => {
    setSelectedNoteLetter(letter);
  };

  const onSelectNoteModifier = (modifier: NoteModifier) => {
    setSelectedNoteModifier(modifier);
  };

  const onNextQuestion = () => {
    setSelectedNoteLetter(null);
    setSelectedNoteModifier(null);
    intervalFindr.generateQuestion();
  };

  const onValidate = () => {
    intervalFindr.answerQuestion({
      name: selectedNoteLetter as NoteName,
      modifier: selectedNoteModifier as NoteModifier,
    });
  };

  const randomizedNoteLetters = useMemo(() => {
    return NOTE_LETTERS.sort(() => Math.random() - 0.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalFindr.questionIndex]);

  const answer = useMemo(() => {
    if (
      !intervalFindr.question ||
      !intervalFindr.question.rootNote ||
      !intervalFindr.question.interval
    )
      return null;

    const { ascending, descending } = applyIntervalToNote(
      intervalFindr.question.rootNote,
      intervalFindr.question.interval
    );
    return intervalFindr.question.direction > 0 ? ascending : descending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalFindr.questionIndex]);

  return (
    <div className="flex flex-col gap-[10px] w-full">
      <div className="flex flex-col gap-[4px]">
        <p className="text-details">{t("note.note")}</p>
        <p className="text-body1">
          {t(
            `note.${settingsNotation}.${intervalFindr.question.rootNote.name}`
          )}
          {intervalFindr.question.rootNote.modifier}
        </p>
      </div>
      <div className="flex flex-col gap-[4px]">
        <p className="text-details">{t("interval.interval")}</p>
        <p className="text-body1">
          {t(`interval.${intervalFindr.question.interval}`)}{" "}
          {intervalFindr.question.direction > 0 ? "↑" : "↓"}
        </p>
      </div>

      <div className="flex flex-col gap-[4px] mt-[20px]">
        <p className="text-details">{t("note.note")}</p>
        <div className="grid grid-cols-4 gap-[10px] w-full">
          {randomizedNoteLetters.map((letter) => (
            <UIButton
              key={letter}
              onClick={() => onSelectNoteLetter(letter)}
              className={twMerge(
                "w-full px-0 py-[10px]",
                selectedNoteLetter === letter && "bg-tertiary",
                success && selectedNoteLetter === letter ? "bg-primary" : "",
                failure && selectedNoteLetter === letter ? "bg-secondary" : "",
                failure && answer?.name === letter && "bg-primary"
              )}
            >
              {t(`note.${settingsNotation}.${letter}`)}
            </UIButton>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-[4px]">
        <p className="text-details">{t("note.modifier")}</p>
        <div className="grid grid-cols-4 gap-[10px] w-full">
          {NOTE_MODIFIERS.map((modifier) => (
            <UIButton
              key={modifier}
              onClick={() => onSelectNoteModifier(modifier)}
              className={twMerge(
                "w-full px-0 py-[10px]",
                selectedNoteModifier === modifier && "bg-tertiary",
                success && selectedNoteModifier === modifier
                  ? "bg-primary"
                  : "",
                failure && selectedNoteModifier === modifier
                  ? "bg-secondary"
                  : "",
                failure && answer?.modifier === modifier && "bg-primary"
              )}
            >
              {modifier}
            </UIButton>
          ))}
        </div>
      </div>

      <UIButton
        disabled={!selectedNoteLetter}
        onClick={success || failure ? onNextQuestion : onValidate}
        className={twMerge(
          "w-full px-0 py-[10px]",
          selectedNoteLetter ? "bg-primary" : "bg-grey-2"
        )}
      >
        {success || failure ? t("common.continue") : t("common.validate")}
      </UIButton>
    </div>
  );
}

import UIInputCheckbox from "@/components/ui/input/checkbox";
import UIRichText from "@/components/ui/richText";
import HomeExercise from "@/features/common/views/home/exercise";
import { useAppDispatch, useAppSelector } from "@/flux/hooks";
import { settingsSetNotation } from "@/flux/settings/reducer";
import { selectSettingsNotation } from "@/flux/settings/selector";
import { SettingsNotation } from "@/flux/settings/type";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  const settingsNotation = useAppSelector(selectSettingsNotation);
  const dispatch = useAppDispatch();

  const onChangeNotation = (notation: SettingsNotation) => {
    dispatch(settingsSetNotation(notation));
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-white px-[20px] pt-[40px] overflow-hidden">
      <p className="text-center text-[40px]">
        <UIRichText>{(tags) => t.rich("features.home.title", tags)}</UIRichText>
      </p>

      <div className="mt-[20px]">
        <div className="flex flex-col gap-[10px] justify-between items-center">
          <div className="flex flex-row gap-[10px] items-center justify-center">
            <div className="flex flex-col gap-[2px] items-center justify-center">
              <p className="text-body4 text-black text-center">
                {t(`note.settings.notation.eu`)}
              </p>
              <UIInputCheckbox
                checked={settingsNotation === "eu"}
                onChange={() => {
                  onChangeNotation("eu");
                }}
              />
            </div>
            <div className="flex flex-col gap-[2px] items-center justify-center">
              <p className="text-body4 text-grey-5">
                {t(`note.settings.notation.us`)}
              </p>
              <UIInputCheckbox
                checked={settingsNotation === "us"}
                onChange={() => {
                  onChangeNotation("us");
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-[20px] flex-1 relative">
        <HomeExercise
          index={0}
          label={t("features.home.exercise.noteGuessr")}
          href="/noteGuessr"
          className="bg-secondary"
        />
        <HomeExercise
          index={1}
          label={t("features.home.exercise.intervalFindr")}
          href="/intervalFindr"
          className="bg-primary"
        />
      </div>
    </div>
  );
}

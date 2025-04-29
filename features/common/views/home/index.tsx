import UIRichText from "@/components/ui/richText";
import HomeExercise from "@/features/common/views/home/exercise";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="flex flex-col h-full w-full relative bg-white px-[20px] pt-[40px] overflow-hidden">
      <p className="text-center text-[40px]">
        <UIRichText>{(tags) => t.rich("features.home.title", tags)}</UIRichText>
      </p>
      <div className="flex flex-col items-center mt-[60px] flex-1 relative">
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

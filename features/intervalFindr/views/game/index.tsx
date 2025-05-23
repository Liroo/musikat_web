import UIButtonDepth from "@/components/ui/button/depth";
import useIntervalFindr from "@/features/intervalFindr/engine/useIntervalFindr";
import IntervalFindrPlaying from "@/features/intervalFindr/views/game/playing";
import IntervalFindrSettings from "@/features/intervalFindr/views/game/settings";
import { twMerge } from "@/utils/twMerge";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function IntervalFindr() {
  const t = useTranslations();
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const intervalFindr = useIntervalFindr({
    onSuccess: () => {
      setSuccess(true);
    },
    onFailure: () => {
      setFailure(true);
    },
  });

  useEffect(() => {
    setSuccess(false);
    setFailure(false);
  }, [intervalFindr.questionIndex]);

  return (
    <div
      className={twMerge(
        "flex flex-col h-full w-full justify-center items-center transition-colors duration-150 relative",
        success ? "bg-primary" : "bg-tertiary"
      )}
    >
      <div className="bg-white rounded-[16px] border border-black p-[40px] w-[400px] max-w-[95vw]">
        {intervalFindr.playing ? null : (
          <Link href="/">
            <div className="mb-[20px]">
              <p className="underline">← {t("common.back")}</p>
            </div>
          </Link>
        )}
        <div className="relative z-10 flex flex-col gap-[40px] justify-center items-center">
          {intervalFindr.playing ? (
            <IntervalFindrPlaying
              intervalFindr={intervalFindr}
              success={success}
              failure={failure}
            />
          ) : (
            <IntervalFindrSettings />
          )}

          <div className="flex flex-col justify-center items-center gap-[10px]">
            <UIButtonDepth
              onClick={
                intervalFindr.playing ? intervalFindr.stop : intervalFindr.start
              }
              className={intervalFindr.playing ? "bg-secondary" : "bg-primary"}
            >
              <p>
                {intervalFindr.playing
                  ? t("features.intervalFindr.stop")
                  : t("features.intervalFindr.start")}
              </p>
            </UIButtonDepth>
          </div>
        </div>
      </div>
    </div>
  );
}

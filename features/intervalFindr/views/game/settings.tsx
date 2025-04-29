import UIInputCheckbox from "@/components/ui/input/checkbox";
import { useAppDispatch, useAppSelector } from "@/flux/hooks";
import { intervalFindrSetSettings } from "@/flux/intervalFindr/reducer";
import { selectIntervalFindrSettings } from "@/flux/intervalFindr/selector";
import { INTERVALS_LIST } from "@/types/interval";
import { useTranslations } from "next-intl";

export default function IntervalFindrSettings() {
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const settings = useAppSelector(selectIntervalFindrSettings);

  const onToggleAllowedInterval = (interval: string) => {
    const newAllowedInterval = [...settings.allowedInterval];
    if (newAllowedInterval.includes(interval)) {
      newAllowedInterval.splice(newAllowedInterval.indexOf(interval), 1);
    } else {
      newAllowedInterval.push(interval);
    }
    dispatch(
      intervalFindrSetSettings({
        ...settings,
        allowedInterval: newAllowedInterval,
      })
    );
  };

  const onToggleAllowedInvertedInterval = () => {
    dispatch(
      intervalFindrSetSettings({
        ...settings,
        allowedInvertedInterval: !settings.allowedInvertedInterval,
      })
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-[10px] items-baseline self-stretch">
      <div className="flex flex-col gap-[10px]">
        <p className="text-body1">
          {t("features.intervalFindr.settings.allowedInterval")}
        </p>
        <div className="grid grid-cols-2 gap-[2px] items-start flex-wrap">
          {INTERVALS_LIST.map((interval) => {
            const intervalName = interval.keys[0];
            return (
              <div className="flex flex-col gap-[2px]" key={intervalName}>
                <p className="text-body4 text-grey-5">
                  {t(`interval.${intervalName}`)}
                </p>
                <UIInputCheckbox
                  checked={settings.allowedInterval.includes(intervalName)}
                  onChange={() => onToggleAllowedInterval(intervalName)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <p className="text-body1">
          {t("features.intervalFindr.settings.allowedInvertedInterval")}
        </p>
        <UIInputCheckbox
          checked={settings.allowedInvertedInterval}
          onChange={onToggleAllowedInvertedInterval}
        />
      </div>
    </div>
  );
}

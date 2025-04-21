"use client";

import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  return (
    <div>
      <h1>{t("commons.hello")}</h1>
    </div>
  );
}

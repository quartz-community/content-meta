export type ValidDateType = "created" | "modified" | "published";

interface Props {
  date: Date;
  locale?: string;
}

export function getDate(
  cfg: { defaultDateType?: string },
  data: Record<string, unknown>,
): Date | undefined {
  if (!cfg.defaultDateType) {
    throw new Error(
      `Field 'defaultDateType' was not set in the configuration object of quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.`,
    );
  }
  const dates = data.dates as Record<string, Date> | undefined;
  return dates?.[cfg.defaultDateType];
}

export function formatDate(d: Date, locale: string = "en-US"): string {
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function DateComponent({ date, locale }: Props) {
  return <time datetime={date.toISOString()}>{formatDate(date, locale)}</time>;
}

export type ValidDateType = "created" | "modified" | "published";

interface Props {
  date: Date;
  locale?: string;
}

export function getDate(
  cfg: { defaultDateType?: string },
  data: Record<string, unknown>,
): Date | undefined {
  const dateType = (data.defaultDateType as string) ?? cfg.defaultDateType;
  if (!dateType) {
    throw new Error(
      `Field 'defaultDateType' was not set. Either configure it in the CreatedModifiedDate plugin options or set it in quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.`,
    );
  }
  const dates = data.dates as Record<string, Date> | undefined;
  return dates?.[dateType];
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

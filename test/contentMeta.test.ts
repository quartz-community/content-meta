import { describe, expect, it } from "vitest";
import type { QuartzComponentProps } from "@quartz-community/types";
import { ContentMeta } from "../src/index";
import type { ContentMetaOptions } from "../src/components/ContentMeta";
import { renderToHtml } from "./render";

const words = (n: number) => Array.from({ length: n }, () => "word").join(" ");
const march = new Date("2024-03-01T12:00:00Z");

function render(
  fileData: Record<string, unknown>,
  opts?: Partial<ContentMetaOptions>,
  cfg: Record<string, unknown> = {},
  displayClass?: string,
) {
  const Component = ContentMeta(opts);
  return renderToHtml(
    Component({ fileData, cfg, displayClass } as unknown as QuartzComponentProps),
  );
}

describe("ContentMeta", () => {
  it("shows the page's default date and the reading time, comma-separated by default", () => {
    const html = render({
      text: words(450),
      dates: { created: new Date("2020-01-01"), modified: march },
      defaultDateType: "modified",
    });
    expect(html).toBe(
      '<p show-comma="true" class="content-meta">' +
        '<time datetime="2024-03-01T12:00:00.000Z">Mar 01, 2024</time>' +
        "<span>3 min read</span></p>",
    );
  });

  it("falls back to the site's defaultDateType", () => {
    const html = render(
      { text: "hi", dates: { created: march, modified: new Date("2020-01-01") } },
      {},
      { defaultDateType: "created" },
    );
    expect(html).toContain('<time datetime="2024-03-01T12:00:00.000Z">');
  });

  it("shows no date without dates or a date type", () => {
    expect(render({ text: "hi" })).not.toContain("<time");
    expect(render({ text: "hi", dates: { modified: march } })).not.toContain("<time");
  });

  it("rounds the reading time up, with the singular for one minute", () => {
    expect(render({ text: "hi" })).toContain("<span>1 min read</span>");
    expect(render({ text: words(201) })).toContain("<span>2 min read</span>");
  });

  it("honours showReadingTime: false and showComma: false", () => {
    const html = render(
      { text: words(450), dates: { modified: march }, defaultDateType: "modified" },
      { showReadingTime: false, showComma: false },
    );
    expect(html).not.toContain("min read");
    expect(html).toContain('show-comma="false"');
    expect(html).toContain("<time");
  });

  it("uses the site locale for the date and the reading time", () => {
    const html = render(
      { text: words(450), dates: { modified: march }, defaultDateType: "modified" },
      {},
      { locale: "de-DE" },
    );
    expect(html).toContain("<span>3 Min. Lesezeit</span>");
    expect(html).toContain(
      `>${march.toLocaleDateString("de-DE", { year: "numeric", month: "short", day: "2-digit" })}</time>`,
    );
  });

  it("adds the layout's display class", () => {
    expect(render({ text: "hi" }, {}, {}, "desktop-only")).toContain(
      'class="desktop-only content-meta"',
    );
  });

  it("renders nothing for a page without text", () => {
    expect(render({ text: "" })).toBe("");
    expect(render({})).toBe("");
  });
});

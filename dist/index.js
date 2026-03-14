import readingTime from 'reading-time';
import { jsx } from 'preact/jsx-runtime';

// src/components/ContentMeta.tsx

// src/util/lang.ts
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/i18n/locales/en-US.ts
var en_US_default = {
  components: {
    contentMeta: {
      readingTime: ({ minutes }) => {
        if (minutes === 1) {
          return "1 min read";
        }
        return `${minutes} min read`;
      }
    }
  }
};

// src/i18n/index.ts
var locales = {
  "en-US": en_US_default
};
function i18n(locale) {
  return locales[locale] || en_US_default;
}
function getDate(cfg, data) {
  if (!cfg.defaultDateType) {
    throw new Error(
      `Field 'defaultDateType' was not set in the configuration object of quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.`
    );
  }
  const dates = data.dates;
  return dates?.[cfg.defaultDateType];
}
function formatDate(d, locale = "en-US") {
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}
function DateComponent({ date, locale }) {
  return /* @__PURE__ */ jsx("time", { datetime: date.toISOString(), children: formatDate(date, locale) });
}

// src/components/styles/contentMeta.scss
var contentMeta_default = '.content-meta {\n  margin-top: 0;\n  color: var(--darkgray);\n}\n.content-meta[show-comma=true] > *:not(:last-child) {\n  margin-right: 8px;\n}\n.content-meta[show-comma=true] > *:not(:last-child)::after {\n  content: ",";\n}';
var defaultOptions = {
  showReadingTime: true,
  showComma: true
};
var ContentMeta_default = ((opts) => {
  const options = { ...defaultOptions, ...opts };
  function ContentMetadata({ cfg, fileData, displayClass }) {
    const text = fileData.text;
    if (text) {
      const segments = [];
      if (fileData.dates) {
        const locale = cfg.locale || "en-US";
        segments.push(/* @__PURE__ */ jsx(DateComponent, { date: getDate(cfg, fileData), locale }));
      }
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text);
        const locale = cfg.locale || "en-US";
        const i18nData = i18n(locale);
        const displayedTime = i18nData.components.contentMeta.readingTime({
          minutes: Math.ceil(minutes)
        });
        segments.push(/* @__PURE__ */ jsx("span", { children: displayedTime }));
      }
      return /* @__PURE__ */ jsx("p", { "show-comma": options.showComma, class: classNames(displayClass, "content-meta"), children: segments });
    } else {
      return null;
    }
  }
  ContentMetadata.css = contentMeta_default;
  return ContentMetadata;
});

export { ContentMeta_default as ContentMeta };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
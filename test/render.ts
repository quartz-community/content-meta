import type { VNode } from "preact";

const escapeText = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttr = (s: string) => escapeText(s).replace(/"/g, "&quot;");
const VOID = new Set(["br", "hr", "img", "input", "link", "meta", "source"]);

/**
 * Minimal preact VNode → HTML serializer for tests (no preact-render-to-string in this repo):
 * calls function components, serializes elements, attributes and text.
 */
export function renderToHtml(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (Array.isArray(node)) return node.map(renderToHtml).join("");
  if (typeof node === "string" || typeof node === "number") return escapeText(String(node));
  const vnode = node as VNode<Record<string, unknown>>;
  if (typeof vnode.type === "function") {
    return renderToHtml((vnode.type as (p: unknown) => unknown)(vnode.props));
  }
  const { children, dangerouslySetInnerHTML, ...attrs } = vnode.props;
  const attributes = Object.entries(attrs)
    // like preact-render-to-string: hyphenated (data-, aria-, custom) attributes keep
    // true/false as strings; other booleans are bare or dropped
    .filter(
      ([key, value]) =>
        value !== null && value !== undefined && (value !== false || key.includes("-")),
    )
    .map(([key, value]) => {
      const name = key === "className" ? "class" : key;
      if (value === true && !key.includes("-")) return ` ${name}`;
      if (typeof value === "object") return ` ${name}="${escapeAttr(JSON.stringify(value))}"`;
      return ` ${name}="${escapeAttr(String(value))}"`;
    })
    .join("");
  const tag = vnode.type as string;
  if (VOID.has(tag)) return `<${tag}${attributes}>`;
  const inner = dangerouslySetInnerHTML
    ? (dangerouslySetInnerHTML as { __html: string }).__html
    : renderToHtml(children);
  return `<${tag}${attributes}>${inner}</${tag}>`;
}

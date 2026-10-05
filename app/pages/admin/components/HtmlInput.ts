import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import sanitizeHtml from "sanitize-html";

const tags = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s", "strike", "del", "code", "pre", "blockquote", "ul", "ol", "li", "a", "img", "br", "hr", "span", "div"];
const htmlPattern = new RegExp(`<\\/?(?:${tags.join("|")})(?:\\s[^>]*|\\s*)>`, "i");

export function cleanEditorHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: tags,
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt", "title"], p: ["style"], div: ["style"], span: ["style"], "*": ["style"] },
    allowedStyles: { "*": { "text-align": [/^(left|center|right|justify)$/] } },
    allowedSchemes: ["https", "http", "mailto", "tel"],
  });
}

/** Convert only recognized HTML; angle brackets in prose and code remain literal. */
export const HtmlInput = Extension.create({
  name: "htmlInput",
  addProseMirrorPlugins() {
    const editor = this.editor;
    return [new Plugin({
      props: {
        handlePaste(_view, event) {
          if (editor.isActive("codeBlock") || editor.isActive("code")) return false;
          const plain = event.clipboardData?.getData("text/plain") ?? "";
          const rich = event.clipboardData?.getData("text/html") ?? "";
          // Raw HTML copied from an LLM may also have an escaped rich-text representation.
          const html = htmlPattern.test(plain)
            ? plain.replace(/^\s*```(?:html)?\s*\n/i, "").replace(/\n\s*```\s*$/, "")
            : rich;
          if (!html || !htmlPattern.test(html)) return false;
          event.preventDefault();
          editor.commands.insertContent(cleanEditorHtml(html));
          return true;
        },
        handleTextInput(view, from, to, text) {
          if (view.composing) return false;
          const $from = view.state.doc.resolve(from);
          const before = $from.parent.textBetween(0, $from.parentOffset, undefined, "\ufffc");
          const match = (before + text).match(/<\s*(\/?)\s*([a-z][a-z0-9]*)\b([^<>]*)>$/i);
          if (!match) return false;
          const [, closing, rawTag] = match;
          const tag = rawTag.toLowerCase();
          if (!tags.includes(tag)) return false;
          if (editor.isActive("codeBlock") && !(closing && tag === "pre")) return false;
          // A closing </code> still ends inline code; other code examples stay literal.
          if (editor.isActive("code") && !(closing && tag === "code")) return false;
          const start = from - (match[0].length - text.length);
          if (start < $from.start()) return false;
          const chain = editor.chain().deleteRange({ from: start, to });
          const marks: Record<string, string> = { strong: "bold", b: "bold", em: "italic", i: "italic", u: "underline", s: "strike", strike: "strike", del: "strike", code: "code", a: "link" };
          const mark = marks[tag];
          if (mark) {
            if (closing) return chain.unsetMark(mark).run();
            if (tag === "a") {
              const doc = new DOMParser().parseFromString(cleanEditorHtml(`${match[0]}link</a>`), "text/html");
              const href = doc.querySelector("a")?.getAttribute("href");
              if (!href) return false;
              return chain.setLink({ href }).run();
            }
            return chain.setMark(mark).run();
          }
          if (closing) {
            if (tag === "ul" || tag === "ol") {
              return chain.splitListItem("listItem").liftListItem("listItem").run();
            }
            if (tag === "blockquote") return chain.splitBlock().lift("blockquote").run();
            if (tag === "li" || tag === "span" || tag === "div") return chain.run();
            if (tag === "pre") return chain.exitCode().run();
            return chain.splitBlock().unsetAllMarks().run();
          }
          if (/^h[1-6]$/.test(tag)) return chain.setHeading({ level: Number(tag[1]) as 1 | 2 | 3 | 4 | 5 | 6 }).run();
          if (tag === "p" || tag === "div") {
            if (before.slice(0, match.index).trim()) return chain.splitBlock().unsetAllMarks().run();
            return chain.setParagraph().run();
          }
          if (tag === "ul") return chain.wrapInList("bulletList").run();
          if (tag === "ol") return chain.wrapInList("orderedList").run();
          if (tag === "li") return before.slice(0, match.index).trim()
            ? chain.splitListItem("listItem").run() : chain.run();
          if (tag === "blockquote") return chain.wrapIn("blockquote").run();
          if (tag === "pre") return chain.setCodeBlock().run();
          if (tag === "br") return chain.setHardBreak().run();
          if (tag === "hr") return chain.setHorizontalRule().run();
          if (tag === "img") return chain.insertContent(cleanEditorHtml(match[0])).run();
          return chain.run();
        },
      },
    })];
  },
});

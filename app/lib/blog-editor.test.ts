import { afterEach, describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { HtmlInput } from "@/pages/admin/components/HtmlInput";
import { buildBlogReviewExport, readPublishedPosts } from "./blog-review-export";

const editors: Editor[] = [];
function createEditor(content = "") {
  const editor = new Editor({ extensions: [StarterKit, Image, HtmlInput], content });
  editors.push(editor);
  return editor;
}
function type(editor: Editor, text: string) {
  for (const char of text) {
    const { from, to } = editor.state.selection;
    const handled = editor.view.someProp("handleTextInput", (handler) => handler(editor.view, from, to, char, () => editor.state.tr.insertText(char, from, to)));
    if (!handled) editor.view.dispatch(editor.state.tr.insertText(char, from, to));
  }
}
function paste(editor: Editor, plain: string, rich = "") {
  const event = { clipboardData: { getData: (format: string) => format === "text/plain" ? plain : rich }, preventDefault() {} } as unknown as ClipboardEvent;
  return editor.view.someProp("handlePaste", (handler) => handler(editor.view, event, null!));
}
afterEach(() => editors.splice(0).forEach((editor) => editor.destroy()));

describe("HTML editor input", () => {
  it("applies nested typed marks immediately and stops them at closing tags", () => {
    const editor = createEditor();
    type(editor, "<strong>Bold <em>both</em> bold</strong> plain");
    expect(editor.getHTML()).toBe("<p><strong>Bold <em>both</em> bold</strong> plain</p>");
  });
  it("preserves a typed heading when its closing tag starts a paragraph", () => {
    const editor = createEditor();
    type(editor, "<h2>Title</h2>Body");
    expect(editor.getHTML()).toMatch(/^<h2>Title<\/h2><p>Body<\/p>(<p><\/p>)?$/);
  });
  it("handles lists and links typed at the caret", () => {
    const editor = createEditor();
    type(editor, '<ul><li>First</li><li>Second</li></ul><a href="https://example.com">Source</a> plain');
    expect(editor.getHTML()).toContain("<ul><li><p>First</p></li><li><p>Second</p></li></ul>");
    expect(editor.getHTML()).toContain('href="https://example.com"');
    expect(editor.getText()).not.toContain("<");
  });
  it("inserts raw HTML copied from AI as formatting, even with an escaped rich copy", () => {
    const editor = createEditor();
    paste(editor, '```html\n<h2>Heading</h2><p>A <strong>bold</strong> word.</p>\n```', '<p>&lt;h2&gt;Heading&lt;/h2&gt;</p>');
    expect(editor.getHTML()).toBe("<h2>Heading</h2><p>A <strong>bold</strong> word.</p>");
    editor.commands.undo();
    expect(editor.getText()).toBe("");
  });
  it("removes scripts, events and unsafe image/link URLs from pasted HTML", () => {
    const editor = createEditor();
    paste(editor, '<p onclick="alert(1)">Safe</p><script>alert(1)</script><img src="javascript:alert(1)"><a href="javascript:alert(1)">Link</a>');
    expect(editor.getHTML()).not.toMatch(/onclick|javascript|script|alert/);
    expect(editor.getText()).toContain("Safe");
  });
  it("leaves comparisons and HTML code examples literal", () => {
    const editor = createEditor();
    type(editor, "2 < 3 > 1");
    expect(editor.getText()).toBe("2 < 3 > 1");
    editor.commands.setCodeBlock();
    type(editor, "<strong>example</strong>");
    expect(editor.getText()).toContain("<strong>example</strong>");
    expect(paste(editor, "<h2>Literal</h2>")).toBeFalsy();
  });
});

describe("manual blog review exports", () => {
  it("includes current details and HTML separately from the optional archive", () => {
    const current = { title: "Unsaved title", slug: "test", content: "<p>Latest edit</p>", tags: ["SEO"], blanks_metadata: [{ id: "example", filled: false }], ai_model: "original-model" };
    const copied = buildBlogReviewExport(current);
    expect(copied).toContain("NOT fact-checked");
    expect(copied).toContain("Unsaved title");
    expect(copied).toContain("<p>Latest edit</p>");
    expect(copied).toContain("original-model");
    expect(copied).toContain("https://sitenova.dev/blog/test");
    expect(copied).not.toContain("PUBLISHED POSTS —");
    expect(buildBlogReviewExport(current, [{ title: "Earlier", slug: "earlier", content: "<p>Full archive body</p>" }])).toContain("Full archive body");
  });
  it("reads beyond a full page and refuses partial downloads on failure", async () => {
    const calls: number[] = [];
    const posts = await readPublishedPosts(async (from) => {
      calls.push(from);
      return Array.from({ length: from === 0 ? 500 : 1 }, (_, index) => ({ title: `Post ${from + index}`, slug: `${from + index}` }));
    });
    expect(posts).toHaveLength(501);
    expect(calls).toEqual([0, 500]);
    await expect(readPublishedPosts(async (from) => {
      if (from > 0) throw new Error("Connection failed");
      return Array.from({ length: 500 }, () => ({ title: "Post", slug: "post" }));
    })).rejects.toThrow("Connection failed");
  });
});

/**
 * TipTapEditor — Full WYSIWYG editor built on TipTap.
 * Toolbar: Bold, Italic, Underline, Strike, H1–H3, ordered/unordered lists,
 * blockquote, code block, link insert, image URL insert, align (left/center/right),
 * horizontal rule, hard break, undo/redo.
 * Output: HTML string via editor.getHTML().
 */

import { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Code2,
  Link2, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
  Minus, CornerDownLeft, Undo2, Redo2,
} from "lucide-react";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, isActive, disabled, label, children }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant={isActive ? "secondary" : "ghost"}
          className={`h-8 w-8 ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">{label}</TooltipContent>
    </Tooltip>
  );
}

export default function TipTapEditor({ content, onChange, placeholder = "Start writing your post…" }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline underline-offset-2" } }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-invert max-w-none min-h-[420px] p-5 focus:outline-none text-foreground/90 leading-relaxed",
      },
    },
  });

  // Sync external content changes (e.g. when loading from Supabase in edit mode)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  const addLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL:", prev ?? "https://");
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  const btn = (props: Omit<ToolbarButtonProps, "children"> & { icon: React.ReactNode }) => (
    <ToolbarButton {...props}>{props.icon}</ToolbarButton>
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div className="border border-border/40 rounded-xl overflow-hidden bg-background/50 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border/30 bg-card/60 backdrop-blur-sm">
          {/* Undo / Redo */}
          {btn({ label: "Undo", icon: <Undo2 className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo() })}
          {btn({ label: "Redo", icon: <Redo2 className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo() })}

          <Separator orientation="vertical" className="h-5 mx-1 bg-border/40" />

          {/* Headings */}
          {btn({ label: "Heading 1", icon: <Heading1 className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive("heading", { level: 1 }) })}
          {btn({ label: "Heading 2", icon: <Heading2 className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive("heading", { level: 2 }) })}
          {btn({ label: "Heading 3", icon: <Heading3 className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor.isActive("heading", { level: 3 }) })}

          <Separator orientation="vertical" className="h-5 mx-1 bg-border/40" />

          {/* Inline marks */}
          {btn({ label: "Bold", icon: <Bold className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive("bold") })}
          {btn({ label: "Italic", icon: <Italic className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive("italic") })}
          {btn({ label: "Underline", icon: <UnderlineIcon className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().toggleUnderline().run(), isActive: editor.isActive("underline") })}
          {btn({ label: "Strikethrough", icon: <Strikethrough className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().toggleStrike().run(), isActive: editor.isActive("strike") })}
          {btn({ label: "Inline Code", icon: <Code className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().toggleCode().run(), isActive: editor.isActive("code") })}

          <Separator orientation="vertical" className="h-5 mx-1 bg-border/40" />

          {/* Lists */}
          {btn({ label: "Bullet List", icon: <List className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive("bulletList") })}
          {btn({ label: "Ordered List", icon: <ListOrdered className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive("orderedList") })}
          {btn({ label: "Blockquote", icon: <Quote className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive("blockquote") })}
          {btn({ label: "Code Block", icon: <Code2 className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().toggleCodeBlock().run(), isActive: editor.isActive("codeBlock") })}

          <Separator orientation="vertical" className="h-5 mx-1 bg-border/40" />

          {/* Alignment */}
          {btn({ label: "Align Left", icon: <AlignLeft className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().setTextAlign("left").run(), isActive: editor.isActive({ textAlign: "left" }) })}
          {btn({ label: "Align Center", icon: <AlignCenter className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().setTextAlign("center").run(), isActive: editor.isActive({ textAlign: "center" }) })}
          {btn({ label: "Align Right", icon: <AlignRight className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().setTextAlign("right").run(), isActive: editor.isActive({ textAlign: "right" }) })}

          <Separator orientation="vertical" className="h-5 mx-1 bg-border/40" />

          {/* Link / Image / HR / Break */}
          {btn({ label: "Link", icon: <Link2 className="w-3.5 h-3.5" />, onClick: addLink, isActive: editor.isActive("link") })}
          {btn({ label: "Image URL", icon: <ImageIcon className="w-3.5 h-3.5" />, onClick: addImage })}
          {btn({ label: "Horizontal Rule", icon: <Minus className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().setHorizontalRule().run() })}
          {btn({ label: "Line Break", icon: <CornerDownLeft className="w-3.5 h-3.5" />, onClick: () => editor.chain().focus().setHardBreak().run() })}
        </div>

        {/* Editor canvas */}
        <EditorContent editor={editor} />
      </div>
    </TooltipProvider>
  );
}

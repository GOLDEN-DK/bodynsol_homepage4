"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const RichTextEditor = ({
  content,
  onChange,
  placeholder = "내용을 입력하세요...",
  readOnly = false,
}: RichTextEditorProps) => {
  // TipTap 에디터 초기화
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // 에디터 내용 업데이트
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // 툴바 버튼 스타일
  const toolbarButtonClass = "p-2 rounded hover:bg-gray-100 focus:outline-none";
  const activeButtonClass = "bg-gray-200";

  if (!editor) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-md"></div>;
  }

  return (
    <div className="rich-text-editor border border-gray-300 rounded-md overflow-hidden">
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-300 bg-gray-50">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${toolbarButtonClass} ${
              editor.isActive("bold") ? activeButtonClass : ""
            }`}
            title="굵게"
          >
            <span className="font-bold">B</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${toolbarButtonClass} ${
              editor.isActive("italic") ? activeButtonClass : ""
            }`}
            title="기울임"
          >
            <span className="italic">I</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${toolbarButtonClass} ${
              editor.isActive("strike") ? activeButtonClass : ""
            }`}
            title="취소선"
          >
            <span className="line-through">S</span>
          </button>
          <span className="mx-1 text-gray-300">|</span>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`${toolbarButtonClass} ${
              editor.isActive("heading", { level: 1 }) ? activeButtonClass : ""
            }`}
            title="제목 1"
          >
            <span className="font-bold">H1</span>
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`${toolbarButtonClass} ${
              editor.isActive("heading", { level: 2 }) ? activeButtonClass : ""
            }`}
            title="제목 2"
          >
            <span className="font-bold">H2</span>
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`${toolbarButtonClass} ${
              editor.isActive("heading", { level: 3 }) ? activeButtonClass : ""
            }`}
            title="제목 3"
          >
            <span className="font-bold">H3</span>
          </button>
          <span className="mx-1 text-gray-300">|</span>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${toolbarButtonClass} ${
              editor.isActive("bulletList") ? activeButtonClass : ""
            }`}
            title="글머리 기호"
          >
            <span>•</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${toolbarButtonClass} ${
              editor.isActive("orderedList") ? activeButtonClass : ""
            }`}
            title="번호 매기기"
          >
            <span>1.</span>
          </button>
          <span className="mx-1 text-gray-300">|</span>
          <button
            type="button"
            onClick={() => {
              const url = window.prompt("URL을 입력하세요:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={`${toolbarButtonClass} ${
              editor.isActive("link") ? activeButtonClass : ""
            }`}
            title="링크"
          >
            <span>🔗</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const url = window.prompt("이미지 URL을 입력하세요:");
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            className={toolbarButtonClass}
            title="이미지"
          >
            <span>🖼️</span>
          </button>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[200px] max-h-[500px] overflow-y-auto"
      />
      <style jsx global>{`
        .ProseMirror {
          min-height: 200px;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;

"use client";

import { useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

const Editor = dynamic(() => import("@monaco-editor/react").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-900">
      <div className="text-gray-400">Loading editor...</div>
    </div>
  ),
});

interface ArticleEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  isDirty: boolean;
}

export function ArticleEditor({ content, onChange, onSave, isDirty }: ArticleEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor;

      // Add Cmd/Ctrl+S save shortcut
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        onSave();
      });
    },
    [onSave]
  );

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      onChange(value || "");
    },
    [onChange]
  );

  return (
    <div className="relative h-full">
      {isDirty && (
        <div className="absolute right-2 top-2 z-10 rounded bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
          Unsaved changes
        </div>
      )}
      <Editor
        height="100%"
        language="markdown"
        theme="vs-dark"
        value={content}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 1.6,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          padding: { top: 16 },
          automaticLayout: true,
        }}
      />
    </div>
  );
}

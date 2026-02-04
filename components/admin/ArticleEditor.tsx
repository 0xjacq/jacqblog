"use client";

import { useEffect, useRef, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from "@codemirror/language";

interface ArticleEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  isDirty: boolean;
}

export function ArticleEditor({ content, onChange, onSave, isDirty }: ArticleEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onSaveRef = useRef(onSave);

  // Keep refs updated
  onChangeRef.current = onChange;
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!containerRef.current) return;

    const saveKeymap = keymap.of([
      {
        key: "Mod-s",
        run: () => {
          onSaveRef.current();
          return true;
        },
      },
    ]);

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChangeRef.current(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        bracketMatching(),
        syntaxHighlighting(defaultHighlightStyle),
        saveKeymap,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        markdown(),
        oneDark,
        updateListener,
        EditorView.lineWrapping,
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "14px",
          },
          ".cm-scroller": {
            overflow: "auto",
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
            lineHeight: "1.6",
          },
          ".cm-content": {
            padding: "16px 0",
          },
          ".cm-gutters": {
            backgroundColor: "#282c34",
            border: "none",
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only run on mount - content sync handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external content changes to editor
  const syncContent = useCallback((newContent: string) => {
    const view = viewRef.current;
    if (!view) return;

    const currentContent = view.state.doc.toString();
    if (currentContent !== newContent) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: newContent,
        },
      });
    }
  }, []);

  // Handle external content updates (e.g., after save resets)
  useEffect(() => {
    // Skip initial render - let the EditorState handle initial content
    const view = viewRef.current;
    if (view) {
      syncContent(content);
    }
  }, [content, syncContent]);

  return (
    <div className="relative h-full min-h-[400px] bg-[#282c34]">
      {isDirty && (
        <div className="absolute right-2 top-2 z-10 rounded bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
          Unsaved changes
        </div>
      )}
      <div
        key={content ? "loaded" : "empty"}
        ref={containerRef}
        className="h-full [&_.cm-editor]:h-full"
      />
    </div>
  );
}

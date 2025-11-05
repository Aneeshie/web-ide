"use client";
import React, { useEffect, useRef } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { TemplateFile } from "../types";
import { configureMonaco, getEditorLanguage } from "../lib/editor-config";

interface PlaygroundEditorProps {
  activeFile: TemplateFile | undefined;
  editorContent: string;
  onContentChange: (content: string) => void;
}

const PlaygroundEditor = ({
  activeFile,
  editorContent,
  onContentChange,
}: PlaygroundEditorProps) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    configureMonaco(monaco);
    updateEditorLanguage();
  };

  const updateEditorLanguage = () => {
    if (!activeFile || !monacoRef.current || !editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    const language = getEditorLanguage(activeFile.fileExtension || "");
    try {
      monacoRef.current.editor.setModelLanguage(model, language);
    } catch (error) {
      console.error("Error setting model language:", error);
    }
  };

  useEffect(() => {
    updateEditorLanguage();
  }, [activeFile]);

  return (
    <div className="h-full relative">
      {/*TODO: AI THINKING */}

      <Editor
        height={"100%"}
        value={editorContent}
        onChange={(value) => onContentChange(value || "")}
        onMount={handleEditorDidMount}
        language={getEditorLanguage(activeFile?.fileExtension || "")}
        options={{
          automaticLayout: true,
          fontSize: 16,
          minimap: { enabled: false },
          wordWrap: "on",
          tabSize: 2,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default PlaygroundEditor;

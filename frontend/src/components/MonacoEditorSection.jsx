import React, { useContext } from "react";
import Editor from "@monaco-editor/react";
import { ThemeContext } from "../context/ThemeContext";

const MonacoEditorSection = ({
  code,
  setCode,
  currentLineNumber,
  errorLineNumber,
}) => {
  const { darkMode } = useContext(ThemeContext);

  const handleEditorDidMount = (editor, monaco) => {
    const applyDecorations = () => {
      const decorations = [];

      if (currentLineNumber) {
        decorations.push({
          range: new monaco.Range(currentLineNumber, 1, currentLineNumber, 1),
          options: {
            isWholeLine: true,
            className: "tracelearn-current-line",
            glyphMarginClassName: "tracelearn-current-line-glyph",
          },
        });
      }

      if (errorLineNumber) {
        decorations.push({
          range: new monaco.Range(errorLineNumber, 1, errorLineNumber, 1),
          options: {
            isWholeLine: true,
            className: "tracelearn-error-line",
            glyphMarginClassName: "tracelearn-error-line-glyph",
          },
        });
      }

      editor.deltaDecorations([], decorations);
    };

    applyDecorations();
  };

  return (
    <div className="h-full rounded-3xl overflow-hidden border border-white/10 shadow-xl">
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value || "")}
        onMount={handleEditorDidMount}
        theme={darkMode ? "vs-dark" : "vs-light"}
        options={{
          fontFamily: "JetBrainsMono",
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          glyphMargin: true,
          padding: { top: 14, bottom: 14 },
          smoothScrolling: true,
          scrollBeyondLastLine: false,
          lineNumbersMinChars: 3,
          roundedSelection: true,
        }}
      />
    </div>
  );
};

export default MonacoEditorSection;
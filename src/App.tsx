import React, { useEffect, useState, useCallback } from 'react';
import Split from 'react-split';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { DEFAULT_CONTENT } from './utils/markdownHelpers';
import { Triangle, Mail, Github, Bot } from 'lucide-react';

const STORAGE_KEY = 'markdown-content';

function App() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [splitSizes, setSplitSizes] = useState([50, 50]);
  const [formatHandler, setFormatHandler] = useState<((prefix: string, suffix?: string, defaultText?: string) => void) | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContent(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content);
  }, [content]);

  const handleInsert = useCallback((text: string) => {
    setContent((prev) => prev + text);
  }, []);

  const handleFormat = useCallback((prefix: string, suffix: string = '', defaultText?: string) => {
    if (formatHandler) {
      formatHandler(prefix, suffix, defaultText);
    }
  }, [formatHandler]);

  const setFormatFunction = useCallback((fn: (prefix: string, suffix?: string, defaultText?: string) => void) => {
    setFormatHandler(() => fn);
  }, []);

  const toggleEditor = () => {
    setIsEditorCollapsed(!isEditorCollapsed);
    if (isPreviewCollapsed) {
      setIsPreviewCollapsed(false);
      setSplitSizes([0, 100]);
    } else {
      setSplitSizes(isEditorCollapsed ? [50, 50] : [2, 98]);
    }
  };

  const togglePreview = () => {
    setIsPreviewCollapsed(!isPreviewCollapsed);
    if (isEditorCollapsed) {
      setIsEditorCollapsed(false);
      setSplitSizes([100, 0]);
    } else {
      setSplitSizes(isPreviewCollapsed ? [50, 50] : [98, 2]);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Triangle 
            className="w-7 h-7 text-indigo-600 logo-icon" 
            strokeWidth={0}
            fill="currentColor"
          />
          <h1 className="font-semibold text-indigo-600 text-lg">MarkBox</h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="mailto:your-email@example.com"
            className="social-icon-link"
            title="联系我们"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
            title="GitHub 仓库"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://chat.openai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
            title="AI 助手"
          >
            <Bot className="w-5 h-5" />
          </a>
        </div>
      </header>
      <div className="flex-1 flex flex-col">
        <Toolbar onInsert={handleInsert} onFormat={handleFormat} />
        <div className="flex-1">
          <Split
            className="split h-full"
            sizes={splitSizes}
            minSize={isEditorCollapsed || isPreviewCollapsed ? 30 : 300}
            maxSize={isEditorCollapsed || isPreviewCollapsed ? 30 : Infinity}
            gutterSize={6}
            direction="horizontal"
            gutterStyle={() => ({
              backgroundColor: '#f3f4f6',
              cursor: 'col-resize',
            })}
            onDragEnd={(sizes) => {
              const minSize = 2;
              const adjustedSizes = sizes.map(size => size < minSize ? minSize : size);
              const total = adjustedSizes.reduce((a, b) => a + b, 0);
              setSplitSizes(adjustedSizes.map(size => (size / total) * 100));
            }}
          >
            <Editor 
              value={content} 
              onChange={setContent} 
              isCollapsed={isEditorCollapsed}
              onToggleCollapse={toggleEditor}
              onFormat={setFormatFunction}
            />
            <Preview 
              content={content} 
              isCollapsed={isPreviewCollapsed}
              onToggleCollapse={togglePreview}
            />
          </Split>
        </div>
      </div>
    </div>
  );
}

export default App;
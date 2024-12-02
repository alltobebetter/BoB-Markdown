import React, { useEffect, useState } from 'react';
import Split from 'react-split';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { DEFAULT_CONTENT } from './utils/markdownHelpers';

const STORAGE_KEY = 'markdown-content';

function App() {
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContent(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content);
  }, [content]);

  const handleInsert = (text: string) => {
    setContent((prev) => prev + text);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toolbar onInsert={handleInsert} />
      <Split
        className="flex-1 flex"
        sizes={[50, 50]}
        minSize={300}
        gutterSize={6}
        gutterStyle={() => ({
          backgroundColor: '#f3f4f6',
          cursor: 'col-resize',
        })}
      >
        <Editor value={content} onChange={setContent} />
        <Preview content={content} />
      </Split>
    </div>
  );
}

export default App;
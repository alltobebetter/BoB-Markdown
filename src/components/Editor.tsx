import React, { useRef, useCallback } from 'react';
import { FileEdit } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function Editor({ value, onChange }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cursorPosition = textareaRef.current?.selectionStart || 0;
      const textBeforeCursor = value.substring(0, cursorPosition);
      const textAfterCursor = value.substring(cursorPosition);
      const currentLine = textBeforeCursor.split('\n').pop() || '';

      // 检测列表类型
      const unorderedMatch = currentLine.match(/^(\s*)[*+-]\s+/);
      const orderedMatch = currentLine.match(/^(\s*)\d+\.\s+/);
      const taskMatch = currentLine.match(/^(\s*)[*+-]\s+\[([ x])\]\s+/);

      if (unorderedMatch || orderedMatch || taskMatch) {
        e.preventDefault();
        const indent = (unorderedMatch || orderedMatch || taskMatch)[1];
        
        // 如果当前行只有列表标记，则结束列表
        if (currentLine.trim() === (unorderedMatch?.[0] || orderedMatch?.[0] || taskMatch?.[0])) {
          onChange(textBeforeCursor.slice(0, -currentLine.length) + textAfterCursor);
          return;
        }

        let newListItem = '';
        if (unorderedMatch) {
          newListItem = `\n${indent}${unorderedMatch[0].trim()} `;
        } else if (orderedMatch) {
          const num = parseInt(orderedMatch[0]) + 1;
          newListItem = `\n${indent}${num}. `;
        } else if (taskMatch) {
          newListItem = `\n${indent}- [ ] `;
        }

        onChange(textBeforeCursor + newListItem + textAfterCursor);
        
        setTimeout(() => {
          const newPosition = cursorPosition + newListItem.length;
          textareaRef.current?.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
    }
  }, [value, onChange]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-2">
        <FileEdit className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-gray-800">编辑器</h2>
      </div>
      <textarea
        ref={textareaRef}
        className="flex-1 w-full p-6 resize-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-shadow font-mono text-gray-800 leading-relaxed"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="在此输入 Markdown 内容..."
        spellCheck="false"
      />
    </div>
  );
}
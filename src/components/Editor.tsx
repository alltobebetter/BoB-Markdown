import React, { useRef, useCallback, useEffect } from 'react';
import { FileEdit, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onFormat: (fn: (prefix: string, suffix?: string, defaultText?: string) => void) => void;
}

export function Editor({ value, onChange, isCollapsed, onToggleCollapse, onFormat }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getSelectedText = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return { text: '', start: 0, end: 0 };
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    return {
      text: selectedText,
      start,
      end
    };
  }, [value]);

  const insertAroundSelection = useCallback((prefix: string, suffix: string = '', defaultText?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { text, start, end } = getSelectedText();
    const newText = text ? prefix + text + suffix : prefix + (defaultText || '') + suffix;
    
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    
    onChange(beforeText + newText + afterText);
    
    // 设置新的光标位置
    setTimeout(() => {
      textarea.focus();
      if (text) {
        // 如果有选中文本，选中包含标记的整个文本
        textarea.setSelectionRange(start, start + newText.length);
      } else if (defaultText) {
        // 如果有默认文本，选中默认文本
        const textStart = start + prefix.length;
        const textEnd = textStart + defaultText.length;
        textarea.setSelectionRange(textStart, textEnd);
      } else {
        // 如果没有选中文本和默认文本，将光标放在标记中间
        const cursorPos = start + prefix.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      }
    }, 0);
  }, [value, onChange, getSelectedText]);

  // 将insertAroundSelection传递给onFormat
  useEffect(() => {
    onFormat(insertAroundSelection);
  }, [onFormat, insertAroundSelection]);

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
        const indent = (unorderedMatch || orderedMatch || taskMatch)?.[1] || '';
        
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

  const handleFormat = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    const lastNewLine = beforeText.lastIndexOf('\n');
    const currentLineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
    const currentLine = value.substring(currentLineStart, end);
    const isAtLineStart = currentLine.trim().length === 0;

    // 处理列表
    if (prefix === '- ' || prefix === '* ' || prefix.match(/^\d+\. /) || prefix === '- [ ] ') {
      // 如果已经选中了文本，为每一行添加列表标记
      if (selectedText) {
        const newText = selectedText
          .split('\n')
          .map(line => prefix + line)
          .join('\n');
        const updatedText = beforeText + newText + afterText;
        onChange(updatedText);
        textarea.value = updatedText;
        textarea.selectionStart = start + prefix.length;
        textarea.selectionEnd = start + newText.length;
      } else {
        // 如果是数字列表，找到上一个数字
        if (prefix.match(/^\d+\. /)) {
          const lines = beforeText.split('\n');
          let nextNumber = 1;
          for (let i = lines.length - 1; i >= 0; i--) {
            const match = lines[i].match(/^(\d+)\. /);
            if (match) {
              nextNumber = parseInt(match[1]) + 1;
              break;
            }
          }
          prefix = `${nextNumber}. `;
        }
        
        // 在当前行开始处插入列表标记
        if (isAtLineStart) {
          const updatedText = beforeText + prefix + afterText;
          onChange(updatedText);
          textarea.value = updatedText;
          textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
        } else {
          const updatedText = value.substring(0, currentLineStart) + prefix + currentLine + afterText;
          onChange(updatedText);
          textarea.value = updatedText;
          textarea.selectionStart = textarea.selectionEnd = currentLineStart + prefix.length + currentLine.length;
        }
      }
      return;
    }

    // 处理其他格式化
    const textToInsert = selectedText || defaultText;
    const updatedText = beforeText + prefix + textToInsert + suffix + afterText;
    onChange(updatedText);
    textarea.value = updatedText;

    if (selectedText) {
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = end + prefix.length;
    } else {
      const cursorPosition = start + prefix.length + defaultText.length;
      textarea.selectionStart = textarea.selectionEnd = cursorPosition;
    }
  };

  return (
    <div className="h-full relative">
      <div className={`absolute inset-y-0 left-0 flex transition-[width] duration-300 ease-in-out ${isCollapsed ? 'w-[30px]' : 'w-full'}`}>
        {isCollapsed ? (
          <div className="h-full flex items-center">
            <button
              onClick={onToggleCollapse}
              className="side-toggle-button group"
              title="展开编辑器"
            >
              <PanelLeftOpen className="w-5 h-5 transition-colors" />
            </button>
          </div>
        ) : (
          <div className="editor-container flex-1 flex flex-col h-full">
            <div className="panel-header">
              <div className="flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-indigo-600" />
                <h2 className="font-semibold text-slate-800">编辑器</h2>
              </div>
              <button
                onClick={onToggleCollapse}
                className="collapse-button"
                title="收起编辑器"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </div>
            <textarea
              ref={textareaRef}
              className="flex-1 w-full p-6 resize-none bg-white focus:outline-none focus:ring-1 focus:ring-indigo-200 
                         transition-shadow font-mono text-slate-700 leading-relaxed placeholder-slate-400"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="在此输入 Markdown 内容..."
              spellCheck="false"
            />
          </div>
        )}
      </div>
    </div>
  );
}
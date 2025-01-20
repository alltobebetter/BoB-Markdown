import React from 'react';
import {
  Bold, Italic, List, ListOrdered, Link, Image, Code2, 
  Heading1, Heading2, Heading3, Quote, Table, Strikethrough,
  CheckSquare, AlignLeft, AlignCenter, AlignRight, CodeSquare,
  ListChecks, Highlighter, Hash, ListTodo, Minus
} from 'lucide-react';

interface ToolbarProps {
  onInsert: (text: string) => void;
  onFormat: (prefix: string, suffix?: string, defaultText?: string) => void;
}

interface Tool {
  icon: React.ComponentType<any>;
  text?: string;
  prefix?: string;
  suffix?: string;
  label: string;
  shortcut?: string;
  group?: string;
  isFormat?: boolean;
  formatWithNewlines?: boolean;
  formatWithNewlineAfter?: boolean;
  defaultText?: string;
  isLink?: boolean;
  isImage?: boolean;
}

export function Toolbar({ onInsert, onFormat }: ToolbarProps) {
  return (
    <div className="bg-white border-b border-slate-200 p-2 flex items-center justify-between sticky top-0 z-10">
      {/* 常用工具 - 左对齐 */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onFormat('# ', '', '标题')}
            className="toolbar-button"
            title="一级标题"
          >
            <Heading1 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFormat('## ', '', '标题')}
            className="toolbar-button"
            title="二级标题"
          >
            <Heading2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFormat('### ', '', '标题')}
            className="toolbar-button"
            title="三级标题"
          >
            <Heading3 className="w-5 h-5" />
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => onFormat('**', '**', '粗体')}
            className="toolbar-button"
            title="粗体"
          >
            <Bold className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFormat('*', '*', '斜体')}
            className="toolbar-button"
            title="斜体"
          >
            <Italic className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFormat('~~', '~~', '删除线')}
            className="toolbar-button"
            title="删除线"
          >
            <Strikethrough className="w-5 h-5" />
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => onFormat('- ')}
            className="toolbar-button"
            title="无序列表"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFormat('1. ')}
            className="toolbar-button"
            title="有序列表"
          >
            <ListOrdered className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFormat('- [ ] ')}
            className="toolbar-button"
            title="任务列表"
          >
            <ListTodo className="w-5 h-5" />
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => onFormat('> ', '', '引用')}
            className="toolbar-button"
            title="引用"
          >
            <Quote className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFormat('`', '`', '代码')}
            className="toolbar-button"
            title="行内代码"
          >
            <Code2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFormat('```\n', '\n```', '在此输入代码')}
            className="toolbar-button"
            title="代码块"
          >
            <CodeSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 不常用工具 - 右对齐 */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onFormat('[', '](url)', '链接文字')}
            className="toolbar-button"
            title="链接"
          >
            <Link className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFormat('![', '](url)', '图片描述')}
            className="toolbar-button"
            title="图片"
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFormat('---\n')}
            className="toolbar-button"
            title="分割线"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => onFormat('| ', ' |\n| --- |', '表格')}
            className="toolbar-button"
            title="表格"
          >
            <Table className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFormat('::: center\n', '\n:::', '居中内容')}
            className="toolbar-button"
            title="居中"
          >
            <AlignCenter className="w-5 h-5" />
          </button>
          <button
            onClick={() => onFormat('::: right\n', '\n:::', '右对齐内容')}
            className="toolbar-button"
            title="右对齐"
          >
            <AlignRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import {
  Bold, Italic, List, ListOrdered, Link, Image, Code, 
  Heading1, Heading2, Heading3, Quote, Table, Strikethrough,
  CheckSquare, AlignLeft, AlignCenter, AlignRight, CodeSquare,
  ListChecks, Highlighter, Hash
} from 'lucide-react';

interface ToolbarProps {
  onInsert: (text: string) => void;
}

interface Tool {
  icon: React.ComponentType<any>;
  text: string;
  label: string;
  shortcut?: string;
  group?: string;
}

export function Toolbar({ onInsert }: ToolbarProps) {
  const tools: Tool[] = [
    // 标题组
    { icon: Heading1, text: '# ', label: '一级标题', shortcut: '1', group: 'headings' },
    { icon: Heading2, text: '## ', label: '二级标题', shortcut: '2', group: 'headings' },
    { icon: Heading3, text: '### ', label: '三级标题', shortcut: '3', group: 'headings' },
    // 文本格式组
    { icon: Bold, text: '**粗体**', label: '粗体', shortcut: 'B', group: 'format' },
    { icon: Italic, text: '*斜体*', label: '斜体', shortcut: 'I', group: 'format' },
    { icon: Strikethrough, text: '~~删除线~~', label: '删除线', shortcut: 'S', group: 'format' },
    { icon: Highlighter, text: '==高亮==', label: '高亮', shortcut: 'H', group: 'format' },
    // 列表组
    { icon: List, text: '\n- ', label: '无序列表', shortcut: 'U', group: 'lists' },
    { icon: ListOrdered, text: '\n1. ', label: '有序列表', shortcut: 'O', group: 'lists' },
    { icon: ListChecks, text: '\n- [ ] ', label: '任务列表', shortcut: 'T', group: 'lists' },
    // 引用和代码组
    { icon: Quote, text: '\n> ', label: '引用', shortcut: 'Q', group: 'quote' },
    { icon: Code, text: '`行内代码`', label: '行内代码', shortcut: '`', group: 'code' },
    { icon: CodeSquare, text: '\n```\n代码块\n```', label: '代码块', shortcut: 'K', group: 'code' },
    // 链接和媒体组
    { icon: Link, text: '[链接文字](链接地址)', label: '链接', shortcut: 'L', group: 'media' },
    { icon: Image, text: '![图片描述](图片地址)', label: '图片', shortcut: 'P', group: 'media' },
    // 对齐方式组
    { icon: AlignLeft, text: '\n::: left\n左对齐文本\n:::\n', label: '左对齐', group: 'align' },
    { icon: AlignCenter, text: '\n::: center\n居中对齐\n:::\n', label: '居中', group: 'align' },
    { icon: AlignRight, text: '\n::: right\n右对齐文本\n:::\n', label: '右对齐', group: 'align' },
    // 其他元素
    { icon: Table, text: '\n| 表头 1 | 表头 2 |\n|--------|--------|\n| 单元格 1 | 单元格 2 |', label: '表格', group: 'other' },
    { icon: Hash, text: '\n---\n', label: '分隔线', group: 'other' },
  ];

  const groupedTools = tools.reduce((acc, tool) => {
    const group = tool.group || 'other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <div className="bg-white border-b px-4 py-2 flex flex-wrap items-center gap-2">
      {Object.entries(groupedTools).map(([group, groupTools]) => (
        <React.Fragment key={group}>
          <div className="flex items-center gap-1">
            {groupTools.map((tool, index) => (
              <button
                key={index}
                onClick={() => onInsert(tool.text)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group relative"
                title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
              >
                <tool.icon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                <span className="sr-only">{tool.label}</span>
              </button>
            ))}
          </div>
          {group !== 'other' && <div className="h-6 w-px bg-gray-200" />}
        </React.Fragment>
      ))}
    </div>
  );
}
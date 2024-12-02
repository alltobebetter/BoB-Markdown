import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options for better code block rendering
marked.setOptions({
  highlight: function(code, lang) {
    return code;
  },
  langPrefix: 'language-',
  gfm: true,
  breaks: true,
});

export function parseMarkdown(content: string): string {
  return DOMPurify.sanitize(marked(content));
}

export function detectList(text: string): string | null {
  const lines = text.split('\n');
  const lastLine = lines[lines.length - 1];
  
  // Detect unordered list
  if (lastLine.trim().match(/^[-*+]\s/)) {
    return '- ';
  }
  
  // Detect ordered list
  const numberedList = lastLine.trim().match(/^(\d+)\.\s/);
  if (numberedList) {
    const nextNumber = parseInt(numberedList[1]) + 1;
    return `${nextNumber}. `;
  }
  
  return null;
}

export const DEFAULT_CONTENT = `# Markdown 编辑器

这是一个**现代化**的 *Markdown* 编辑器，支持实时预览。

## 主要功能
- 实时预览，支持精美排版
- 自动续行列表功能
- 丰富的快捷工具栏
- 本地存储，刷新不丢失
- 响应式分栏布局
- 代码块高亮显示

### 快速开始：
1. 点击顶部工具栏按钮插入格式
2. 输入列表会自动续行
3. 支持快捷键操作
4. 可以插入图片和链接
5. 支持表格编辑

> **提示**：悬停在工具栏按钮上可以查看快捷键！

\`\`\`javascript
// 这是一个代码块示例
function hello() {
  console.log("你好，世界！");
}
\`\`\`

祝您写作愉快！✨`;
import React, { useEffect, useRef } from 'react';
import { Eye, PanelRightClose, PanelRightOpen, Download, Image } from 'lucide-react';
import { parseMarkdown } from '../utils/markdownHelpers';
import html2canvas from 'html2canvas';

interface PreviewProps {
  content: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Preview({ content, isCollapsed, onToggleCollapse }: PreviewProps) {
  const htmlContent = parseMarkdown(content);
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 导出为 Markdown 文件
  const handleExportMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-export.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 导出为图片
  const handleExportImage = async () => {
    if (contentRef.current) {
      try {
        const canvas = await html2canvas(contentRef.current);
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-preview.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error('导出图片失败:', error);
      }
    }
  };

  useEffect(() => {
    if (!previewRef.current) return;

    // 为所有代码块添加复制按钮和语言标签
    const codeBlocks = previewRef.current.querySelectorAll('pre');
    codeBlocks.forEach(pre => {
      // 如果已经处理过，就不再处理
      if (pre.querySelector('.copy-button')) return;

      // 添加语言标签
      const code = pre.querySelector('code');
      const languageTag = document.createElement('span');
      languageTag.className = 'language-tag';
      
      // 检测语言
      let language = 'Code';
      if (code) {
        const classes = Array.from(code.classList);
        const langClass = classes.find(cls => cls.startsWith('language-'));
        if (langClass) {
          language = langClass.replace('language-', '');
          // 首字母大写
          language = language.charAt(0).toUpperCase() + language.slice(1);
        }
      }
      languageTag.textContent = language;
      pre.appendChild(languageTag);

      // 添加复制按钮
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.textContent = '复制';
      
      button.addEventListener('click', async () => {
        if (!code) return;

        try {
          await navigator.clipboard.writeText(code.textContent || '');
          button.textContent = '已复制！';
          button.classList.add('copied');
          
          // 2秒后恢复原状
          setTimeout(() => {
            button.textContent = '复制';
            button.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('复制失败:', err);
          button.textContent = '复制失败';
          setTimeout(() => {
            button.textContent = '复制';
          }, 2000);
        }
      });

      pre.classList.add('group');
      pre.appendChild(button);
    });
  }, [htmlContent]); // 当内容变化时重新添加按钮和标签

  return (
    <div className="h-full relative">
      <div className={`absolute inset-y-0 right-0 flex transition-[width] duration-300 ease-in-out ${isCollapsed ? 'w-[30px]' : 'w-full'}`}>
        {isCollapsed ? (
          <div className="h-full flex items-center">
            <button
              onClick={onToggleCollapse}
              className="side-toggle-button group"
              title="展开预览"
            >
              <PanelRightOpen className="w-5 h-5 transition-colors" />
            </button>
          </div>
        ) : (
          <div className="preview-container flex-1 flex flex-col h-full">
            <div className="panel-header">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                <h2 className="font-semibold text-slate-800">预览</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportMarkdown}
                  className="export-button"
                  title="导出为 Markdown"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleExportImage}
                  className="export-button"
                  title="导出为图片"
                >
                  <Image className="w-5 h-5" />
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1" />
                <button
                  onClick={onToggleCollapse}
                  className="collapse-button"
                  title="收起预览"
                >
                  <PanelRightClose className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div 
              ref={previewRef}
              className="flex-1 p-6 overflow-y-auto prose prose-slate prose-headings:font-semibold 
                         prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                         prose-img:rounded-lg prose-img:shadow-md"
            >
              <div ref={contentRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
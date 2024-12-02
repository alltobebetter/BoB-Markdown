import React from 'react';
import { Eye } from 'lucide-react';
import { parseMarkdown } from '../utils/markdownHelpers';

interface PreviewProps {
  content: string;
}

export function Preview({ content }: PreviewProps) {
  const htmlContent = parseMarkdown(content);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-2">
        <Eye className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-gray-800">预览</h2>
      </div>
      <div 
        className="flex-1 p-6 overflow-auto prose prose-slate max-w-none bg-white"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
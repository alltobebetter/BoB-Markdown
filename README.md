# BoB Markdown Editor

这是一个使用 Vite 构建的 React + TypeScript 项目模板，集成了 Tailwind CSS 和 Lucide React 图标库。

## 项目结构

- `src/`：源代码目录
  - `components/`：React 组件
  - `utils/`：实用工具函数
  - `App.tsx`：应用程序的主组件
  - `main.tsx`：应用程序的入口文件
- `public/`：静态资源目录
- `index.html`：HTML 模板文件
- `package.json`：项目依赖和脚本
- `tailwind.config.js`：Tailwind CSS 配置文件
- `postcss.config.js`：PostCSS 配置文件
- `tsconfig.json`：TypeScript 配置文件

## 功能

- **实时 Markdown 编辑器**：支持实时预览和本地存储。
- **丰富的工具栏**：提供多种文本格式和列表插入功能。
- **响应式布局**：使用 Split.js 实现可调整的分栏布局。
- **代码高亮**：支持代码块高亮显示。
- **图标和图片**：使用 Lucide React 图标和 Unsplash 图片。

## 安装与使用

1. 克隆项目到本地：

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 启动开发服务器：

   ```bash
   npm run dev
   ```

4. 构建生产版本：

   ```bash
   npm run build
   ```

5. 预览生产版本：

   ```bash
   npm run preview
   ```

## 开发指南

- **代码风格**：使用 ESLint 进行代码检查，遵循推荐的 JavaScript 和 TypeScript 规则。
- **样式**：使用 Tailwind CSS 进行样式开发，支持自定义主题和插件。
- **图标**：使用 Lucide React 提供的图标，避免安装额外的图标库。
- **图片**：使用 Unsplash 提供的图片链接，避免下载图片到本地。

## 贡献

欢迎提交问题和请求功能。如果您想贡献代码，请 fork 本项目并提交 pull request。

## 许可证

本项目使用 MIT 许可证。

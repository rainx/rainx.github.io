# xprompt — 可组合提示词片段系统

## 概述

构建一个个人可组合提示词片段（prompt snippet）系统，包含：

1. **片段仓库** — 以 markdown 文件形式管理，存放在代码仓库的 `prompts/` 目录下
2. **CLI 工具 `xprompt`** — Node.js/TypeScript 实现，提供查询、组合、构建功能，支持被其他工具/skill 集成
3. **Web 界面 `/prompt`** — 极简工具风格的独立子应用，左右分栏布局，搜索+预览+复制

## 架构决策

| 决策项         | 选择                                       | 理由                                |
| -------------- | ------------------------------------------ | ----------------------------------- |
| 片段层级       | 两层（原子 + 组合）                        | 简洁，避免过度抽象                  |
| 元数据格式     | YAML frontmatter                           | 与 md 文件一体，git 友好            |
| 组合方式       | frontmatter `includes` 字段引用原子片段 ID | 组合片段本身也是 md，可附加额外内容 |
| Web 与主站关系 | Vite multi-page 独立子应用                 | 与主站解耦，独立组件树              |
| Web 数据源     | CLI `xprompt build` 预生成 `catalog.json`  | Web 端零解析，纯消费 JSON           |
| CLI 语言       | Node.js / TypeScript                       | 与项目技术栈一致                    |
| Web 布局       | 左右分栏（列表 + 预览）                    | 信息密度高，浏览体验好              |
| CLI 集成方式   | stdout + `--json` flag                     | 方便程序化调用和管道操作            |

## 片段文件结构

### 目录布局

```
prompts/
├── atoms/                          ← 原子片段
│   ├── typography/
│   │   └── font-preferences.md
│   ├── visual/
│   │   ├── color-palette.md
│   │   └── layout-principles.md
│   ├── writing/
│   │   ├── tone-of-voice.md
│   │   └── content-structure.md
│   └── technical/
│       ├── export-settings.md
│       └── video-encoding.md
├── composites/                     ← 组合片段
│   ├── presentation.md
│   ├── video-creation.md
│   └── blog-writing.md
└── catalog.json                    ← xprompt build 生成，git ignored
```

### 原子片段格式

```markdown
---
id: font-preferences
name: 字体偏好
category: typography
tags: [font, design, visual]
description: 排版字体选择偏好
---

- 非 sans-serif 字体优先
- 中文：Source Han Sans
- 英文：Inter, Open Sans
- Monospaced：Fira Code
```

### 组合片段格式

```markdown
---
id: presentation
name: 演示文稿制作
includes:
  - font-preferences
  - color-palette
  - layout-principles
  - content-structure
tags: [presentation, design]
description: 制作演示文稿时的完整提示词
---

## 额外指导

- 每页内容不超过 3 个要点
- 使用 16:9 比例
- 关键数据用图表而非文字
```

### frontmatter 字段定义

**原子片段：**

| 字段          | 类型     | 必填 | 说明                                              |
| ------------- | -------- | ---- | ------------------------------------------------- |
| `id`          | string   | 是   | 唯一标识符，kebab-case                            |
| `name`        | string   | 是   | 显示名称                                          |
| `category`    | string   | 是   | 分类（typography, visual, writing, technical 等） |
| `tags`        | string[] | 否   | 标签，用于搜索和过滤                              |
| `description` | string   | 是   | 一行描述                                          |

分类（`category`）以 frontmatter 中的值为准，目录子文件夹仅为人工组织便利，不作为元数据来源。

**组合片段：**

| 字段          | 类型     | 必填 | 说明                   |
| ------------- | -------- | ---- | ---------------------- |
| `id`          | string   | 是   | 唯一标识符，kebab-case |
| `name`        | string   | 是   | 显示名称               |
| `includes`    | string[] | 是   | 引用的原子片段 ID 列表 |
| `tags`        | string[] | 否   | 标签                   |
| `description` | string   | 是   | 一行描述               |

**约束：** `includes` 只能引用原子片段 ID。组合片段不能引用其他组合片段。`xprompt build` 时校验此约束，违反则报错退出。

## CLI `xprompt`

### 目录结构

```
tools/xprompt/
├── package.json              ← name: "xprompt", bin: { "xprompt": "./dist/cli.js" }
├── tsconfig.json
└── src/
    ├── cli.ts                ← 入口，命令分发
    ├── parser.ts             ← 解析 md frontmatter + 正文
    ├── resolver.ts           ← 解析 includes 引用，组合拼接
    ├── catalog.ts            ← 扫描 prompts/ 生成 catalog.json
    └── commands/
        ├── list.ts           ← 列出片段
        ├── show.ts           ← 显示单个片段内容
        ├── compose.ts        ← 组合并输出
        └── build.ts          ← 生成 catalog.json
```

### 命令

```bash
# 列出片段
xprompt list                        # 全部
xprompt list --type atoms           # 仅原子
xprompt list --type composites      # 仅组合
xprompt list --category typography  # 按分类
xprompt list --tag design           # 按标签

# 显示单个片段
xprompt show font-preferences       # 原子片段：输出正文内容
xprompt show presentation           # 组合片段：输出完整组合后内容（等同 compose）

# 组合输出
xprompt compose presentation        # 输出组合片段的完整拼接结果
xprompt compose --pick font-preferences color-palette  # 临时选取多个原子片段组合

# 生成 catalog.json
xprompt build                       # 扫描 prompts/，输出 prompts/catalog.json
```

### 错误处理

- frontmatter 解析失败（YAML 格式错误、必填字段缺失）→ 报错并指明文件路径和具体问题，exit 1
- `includes` 引用了不存在的原子片段 ID → 报错 `Unknown atom ID: <id> in <composite-file>`，exit 1
- `includes` 引用了组合片段 → 报错 `Composite cannot include another composite: <id>`，exit 1
- ID 重复 → 报错 `Duplicate snippet ID: <id> in <file1> and <file2>`，exit 1
- `compose --pick` 或 `show` 指定了不存在的 ID → 报错 `Unknown snippet ID: <id>`，exit 1

### 组合拼接规则

组合后的输出按以下顺序拼接，各部分之间用 `\n\n` 分隔：

1. 按 `includes` 数组顺序，依次拼接每个原子片段的正文
2. 最后拼接组合片段自身的正文（如有）

`xprompt compose --pick` 的拼接顺序与命令行参数顺序一致。

### 集成接口

- **stdout** — `xprompt compose presentation` 输出纯文本，调用方捕获 stdout
- **`--json` flag** — `xprompt list --json` 输出结构化 JSON，方便程序化消费

### `catalog.json` 结构

```json
{
  "atoms": [
    {
      "id": "font-preferences",
      "name": "字体偏好",
      "category": "typography",
      "tags": ["font", "design", "visual"],
      "description": "排版字体选择偏好",
      "content": "- 非 sans-serif 字体优先\n- 中文：Source Han Sans\n..."
    }
  ],
  "composites": [
    {
      "id": "presentation",
      "name": "演示文稿制作",
      "includes": [
        "font-preferences",
        "color-palette",
        "layout-principles",
        "content-structure"
      ],
      "tags": ["presentation", "design"],
      "description": "制作演示文稿时的完整提示词",
      "content": "## 额外指导\n- 每页内容不超过 3 个要点\n...",
      "composed": "（完整拼接后的内容，包含所有引用片段的正文 + 组合片段自身正文）"
    }
  ]
}
```

## Web 界面 `/prompt`

### 目录结构

```
src/prompt/
├── index.html                ← 独立 HTML 入口
├── main.tsx                  ← React 入口
├── app.tsx                   ← 主应用：搜索 + 分栏布局
├── components/
│   ├── search-bar.tsx
│   ├── snippet-list.tsx      ← 左侧列表
│   ├── snippet-preview.tsx   ← 右侧预览
│   └── copy-button.tsx
├── app.module.css
└── types.ts                  ← catalog.json 的类型定义
```

### Vite 配置

在 `vite.config.ts` 中增加多页入口：

```ts
build: {
  rollupOptions: {
    input: {
      main: 'index.html',
      prompt: 'src/prompt/index.html',
    },
  },
}
```

### 布局

左右分栏：

- **左栏**：搜索框 + 分类过滤标签 + 片段列表（区分 atom/composite 类型标记）
- **右栏**：选中片段的完整内容预览（组合片段显示 `composed` 字段）+ Copy 按钮

### 数据流

1. `pnpm build` 前自动执行 `xprompt build`（通过 `prebuild` npm script）
2. `xprompt build` 生成 `prompts/catalog.json`
3. Web 子应用 `import catalog from '../../prompts/catalog.json'`
4. 运行时纯前端：过滤、搜索、展示，无需后端

### 功能

- 搜索框：按 name、description、tags 模糊搜索
- 分类过滤：按 category 标签切换
- 类型切换：atoms / composites / all
- 点击片段 → 右侧预览完整内容
- Copy 按钮：复制完整内容到剪贴板

### 界面状态

- **初始状态**（无选中）：右栏显示简要使用说明（"点击左侧片段预览内容"）
- **无搜索结果**：列表区域显示 "No snippets found"
- **catalog.json 不存在或为空**：显示提示 "Run `xprompt build` to generate the catalog"

### 视觉风格

- 暗色主题
- 极简工具风格，无装饰性元素
- atom 和 composite 用不同颜色标记区分

## 构建与部署

### npm scripts 变更

```json
{
  "scripts": {
    "predev": "tsx tools/xprompt/src/cli.ts build",
    "prebuild": "tsx tools/xprompt/src/cli.ts build",
    "build": "tsc && vite build",
    "xprompt": "tsx tools/xprompt/src/cli.ts"
  }
}
```

`xprompt` CLI 直接用 `tsx` 运行源码，无需独立编译步骤。`tools/xprompt/` 共享根项目的 `node_modules`（通过根 `package.json` 安装依赖），不需要独立的 `pnpm install`。

### .gitignore 追加

```
prompts/catalog.json
.superpowers/
```

### 部署

与现有 GitHub Pages 部署流程一致，`pnpm deploy` 会先触发 `prebuild` → `build`，将 `/prompt` 子应用一同打包到 `dist/prompt/index.html`。

最终访问地址：`https://www.rainx.cc/prompt`

---
id: rainx-coding-preferences
name: RainX 编程偏好
category: rainx
tags: [coding, programming, maintainability, testing, toolchain, personal]
description: RainX 的编程风格、可维护性、工具链与质量偏好
---

## 可维护性

- 类型严格：充分利用类型系统约束代码质量，禁止使用 TypeScript `any`、Python 无类型注解等宽松写法
- 严谨优先：在灵活性与严谨性之间偏向严谨——宁可编译期报错，不要运行时踩坑
- 遵循最佳实践：遵守语言社区公认的惯例与规范（如 Effective Go、PEP 8、TypeScript Strict Mode）
- 拥抱新特性：在项目无特殊约束时，优先使用语言和框架的最新稳定特性来简化代码与降低维护成本
- 自解释命名：函数、类、变量等命名要语义清晰，能自解释用途，减少对注释的依赖
- 日志系统：配置结构化日志，开发环境默认输出日志，生产环境默认关闭或仅输出 warn/error
- 文档同步：文档应反映最新代码状态，代码变更时同步更新相关文档
- 回归测试：测试是质量底线，补齐测试覆盖，尤其是核心逻辑与边界情况

## 工具链

- **TypeScript 项目**：优先使用 pnpm 作为包管理器；CLI 工具可选 tsx 或 bun 作为运行时
- **Python 项目**：使用 uv 管理依赖、构建、虚拟环境和运行

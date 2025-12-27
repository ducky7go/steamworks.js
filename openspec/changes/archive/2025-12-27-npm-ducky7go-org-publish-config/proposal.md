# Change: 修改发布到的 npm 组织

## Why

当前项目 `steamworks.js` 作为非作用域包发布到 npm registry。为了更好地组织和管理包，需要将其迁移到 `@ducky7go` 组织作用域下。这将提供：
- 更好的包命名空间管理
- 统一的组织级包管理
- 更清晰的包所有权归属

## What Changes

- **BREAKING**: 修改包名从 `steamworks.js` 变更为 `@ducky7go/steamworks.js`
- 更新 `package.json` 中的 `name` 字段为 `@ducky7go/steamworks.js`
- 更新 `package.json` 中的 `napi.name` 字段为 `@ducky7go/steamworksjs`（native 模块名称）
- 更新 GitHub Actions 发布工作流的仓库检查条件
- 更新 README.md 中的安装说明和包名引用
- 更新项目文档中的包名引用

## Impact

- Affected specs:
  - `npm-publish` (新增 capability)
- Affected code:
  - `package.json:2` - package name 字段
  - `package.json:7` - napi name 字段
  - `.github/workflows/publish.yml:117` - deploy 条件检查
  - `README.md` - 安装说明和文档

## Migration Path

用户需要：
1. 更新 `package.json` 中的依赖声明从 `steamworks.js` 改为 `@ducky7go/steamworks.js`
2. 重新安装依赖：`npm install`
3. 代码中的 `require('steamworks.js')` 保持不变（由 npm 处理作用域包解析）

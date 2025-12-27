# Design: npm 组织作用域迁移

## Context

当前 `steamworks.js` 项目作为无作用域的 npm 包发布。npm 作用域包（如 `@ducky7go/package-name`）提供：
- 组织级别的命名空间
- 更清晰的包所有权
- 默认私有发布（可配置为公开）

## Goals / Non-Goals

### Goals
- 将包发布到 `@ducky7go` npm 组织
- 确保 CI/CD 流程正确配置
- 保持向后兼容性（尽可能减少用户代码变更）

### Non-Goals
- 不改变 native 模块的二进制接口
- 不改变 API 接口
- 不改变包的语义化版本策略

## Decisions

### 1. 包名变更

**Decision**: 包名从 `steamworks.js` 变更为 `@ducky7go/steamworks.js`

**Rationale**:
- npm 作用域包是组织级包管理的标准方式
- `@ducky7go` 组织提供统一的命名空间
- 符合 npm 最佳实践

**Alternatives considered**:
- 保持无作用域包名：不利于组织级管理
- 使用其他作用域（如 `@ceifa`）：不符合组织需求

### 2. Native 模块名称

**Decision**: `napi.name` 保持为 `steamworksjs`（不加作用域前缀）

**Rationale**:
- Native 模块绑定名称不需要作用域
- 保持与现有代码兼容
- `@napi-rs/cli` 处理作用域包的 native 模块加载

### 3. 仓库条件检查

**Decision**: 更新 GitHub Actions 中的仓库检查条件

**Rationale**:
- 当前检查条件为 `github.repository == 'ceifa/steamworks.js'`
- 仓库已迁移到 `ducky7go/steamworks.js`
- 需要更新为 `github.repository == 'ducky7go/steamworks.js'`

**Implementation**:
- 更新仓库检查条件为 `ducky7go/steamworks.js`

### 4. npm Registry 配置

**Decision**: 不创建 `.npmrc` 文件，使用 GitHub Actions secrets

**Rationale**:
- npm token 已通过 `NPM_TOKEN` secret 配置
- 作用域包不需要特殊的 registry 配置
- 简化项目配置

## Risks / Trade-offs

### Risk 1: Breaking Change for Users

**Risk**: 用户需要更新 `package.json` 依赖

**Mitigation**:
- 在 README.md 中提供清晰的迁移指南
- 保留旧版本包在 npm 上（不弃用）
- 发布迁移说明

### Risk 2: CI/CD 配置错误

**Risk**: 发布流程可能因作用域配置失败

**Mitigation**:
- 确保有 `@ducky7go` 组织的 npm token 权限
- 在 PR 状态下验证构建流程
- 测试 npm publish dry-run

### Risk 3: 文档引用不一致

**Risk**: 文档中可能残留旧的包名引用

**Mitigation**:
- 全面搜索并替换所有 `steamworks.js` 包名引用
- 更新 README.md 安装说明
- 更新 badges 链接

## Migration Plan

### 实施步骤

1. **更新 package.json**
   - 修改 `name` 为 `@ducky7go/steamworks.js`
   - 保持 `napi.name` 为 `steamworksjs`

2. **更新 GitHub Actions**
   - 修改 `publish.yml` 中的仓库检查条件（如需要）

3. **更新文档**
   - README.md 安装说明
   - Badges 链接
   - 所有包名引用

4. **配置 npm 组织**
   - 确保 `@ducky7go` 组织存在
   - 配置 NPM_TOKEN secret 有发布权限

5. **测试发布**
   - 创建 PR 验证构建
   - 合并后验证发布

### 回滚计划

如果发布失败：
1. 回退 `package.json` 的 name 字段
2. 重新发布原版本
3. 调查问题原因后重试

## Open Questions

- [ ] `@ducky7go` npm 组织是否已创建？
- [x] 目标仓库是 `ducky7go/steamworks.js`（已确认）
- [ ] 是否需要同时发布两个版本（新旧包名）一段时间？
- [ ] 旧包是否需要发布弃用通知？

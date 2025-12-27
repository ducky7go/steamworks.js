# Design: Release Drafter Integration

## Context

The steamworks.js project is a TypeScript/Rust hybrid package that publishes native npm modules. The current CI/CD pipeline builds binaries for multiple platforms (Windows x64, Linux x64, macOS x64/ARM64) and publishes to npm. There is no automated release notes generation or version-tagged release workflow.

**Stakeholders**:
- Project maintainers: Need efficient release process
- Contributors: Need clear commit conventions
- Users: Need structured changelog information

**Constraints**:
- Must work with existing npm publish workflow
- Must support both pre-release and official release workflows
- Must not break existing CI/CD pipeline

## Goals / Non-Goals

**Goals**:
1. Automate release notes generation from conventional commits
2. Support pre-release builds for testing (main branch pushes)
3. Support official releases for production (git tags)
4. Maintain compatibility with existing publish.yml workflow
5. Use standard conventional commit patterns

**Non-Goals**:
1. Automatic version bumping (versions managed manually via tags)
2. Automatic npm publishing on release (existing workflow handles this)
3. Custom release note templates beyond standard categories
4. Integration with external issue trackers

## Decisions

### Decision 1: Use Release Drafter GitHub Action

**Rationale**: Release Drafter is a well-maintained, widely-used action specifically designed for this use case. It requires minimal configuration and integrates seamlessly with GitHub Releases.

**Alternatives Considered**:
| Option | Pros | Cons |
|--------|------|------|
| Release Drafter | Purpose-built, low config, community support | Limited customization |
| Custom workflow script | Full control | Maintenance burden, reinventing wheel |
| semantic-release | Automates versioning | Overkill, npm-centric |

### Decision 2: Dual-Trigger Strategy

**Configuration**:
- Pre-release trigger: `push` to `main` branch
- Official release trigger: `push` to `refs/tags/v*`

**Rationale**: This allows continuous testing builds while maintaining clear separation between test releases and production releases.

### Decision 3: Commit Label Mapping

**Categories**:
- `feat`: New Features
- `fix`: Bug Fixes
- `breaking-change`: Breaking Changes
- `docs`: Documentation
- `style`: Code Style
- `refactor`: Code Refactoring
- `perf`: Performance Improvements
- `test`: Tests
- `build`: Build System
- `ci`: CI Configuration

**Rationale**: Follows conventional commits specification with familiar categories for developers.

### Decision 4: Version Tag Format

**Format**: `v` prefix (e.g., `v1.2.3`)

**Rationale**: Industry standard, matches semantic versioning conventions, compatible with Release Drafter defaults.

## Architecture

```
                    ┌─────────────────────┐
                    │   Push to main      │
                    └──────────┬──────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  CI Build & Test        │
                    │  (existing publish.yml) │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Release Drafter        │
                    │  (pre-release mode)     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Create Pre-release     │
                    │  (Latest main build)    │
                    └─────────────────────────┘


                    ┌─────────────────────┐
                    │   Push tag v*.*.*    │
                    └──────────┬──────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  CI Build & Test        │
                    │  (existing publish.yml) │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Release Drafter        │
                    │  (official release)     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Create GitHub Release  │
                    │  with changelog         │
                    └─────────────────────────┘
```

## Configuration Files

### `.github/release-drafter.yml`

```yaml
name: Release Drafter
version-template: $MAJOR.$MINOR.$PATCH
tag-template: v$MAJOR.$MINOR.$PATCH
categories:
  - title: '🚀 New Features'
    labels:
      - 'feat'
      - 'feature'
  - title: '🐛 Bug Fixes'
    labels:
      - 'fix'
      - 'bugfix'
  - title: '⚠️ Breaking Changes'
    labels:
      - 'breaking-change'
  - title: '📚 Documentation'
    labels:
      - 'docs'
  - title: '🎨 Code Style'
    labels:
      - 'style'
  - title: '♻️ Code Refactoring'
    labels:
      - 'refactor'
  - title: '⚡ Performance Improvements'
    labels:
      - 'perf'
  - title: '✅ Tests'
    labels:
      - 'test'
  - title: '🤖 Build System'
    labels:
      - 'build'
  - title: '🔧 CI Configuration'
    labels:
      - 'ci'
change-template: '- $TITLE @$AUTHOR (#$PR)'
template: |
  ## What's Changed

  $CHANGES
```

### `.github/workflows/release-drafter.yml`

```yaml
name: Release Drafter

on:
  push:
    branches:
      - main
  # Official releases: triggered by tag
  push:
    tags:
      - 'v*'

permissions:
  contents: write

jobs:
  update_release_draft:
    runs-on: ubuntu-latest
    steps:
      - uses: release-drafter/release-drafter@v5
        with:
          config-name: release-drafter.yml
          publish: ${{ startsWith(github.ref, 'refs/tags/') }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Migration Plan

**Steps**:
1. Create `.github/release-drafter.yml` configuration
2. Create `.github/workflows/release-drafter.yml` workflow
3. Push changes to main branch
4. Verify pre-release is created automatically
5. Test official release by pushing a version tag
6. Update contributor documentation

**Rollback**:
- Delete the workflow files to revert to manual release process
- Existing releases remain unchanged

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Conflicting workflows | CI failures | Test thoroughly in fork first |
| Poor commit messages | Unclear release notes | Add commit conventions to CONTRIBUTING.md |
| Pre-release spam | Too many releases | Consider pre-release only for merged PRs |
| Tag push conflicts | Failed official releases | Document proper tag push procedure |

## Open Questions

None at this time. The design follows established patterns from Release Drafter documentation.

# Proposal: GitHub 发布版本号支持

## Meta

- **Change ID**: `github-release-version-support`
- **Status**: ExecutionCompleted
- **Created**: 2025-12-27
- **Author**: AI Assistant

## Why

The current project lacks automated version management for npm releases. Maintainers must manually update `package.json` versions before each release, and there's no mechanism to publish development builds for testing between official releases.

This change addresses the need for:
1. **Automated release workflows** - Reducing manual overhead and potential for human error
2. **Development build availability** - Allowing users to test cutting-edge features without waiting for official releases
3. **Semantic version consistency** - Ensuring npm versions align with GitHub release tags
4. **CI/CD best practices** - Following industry standards for automated version management

## Overview

Enhance the GitHub Actions CI/CD pipeline to support automated version management for both official releases (via Git tags) and development releases (via main branch commits).

## Problem Statement

The current `publish.yml` workflow has the following limitations:

1. **No tag-based release support**: The workflow triggers on every push to `main` but does not distinguish between official releases (tags) and development builds
2. **No development versioning**: When commits are pushed to `main`, there's no mechanism to generate incremental development version numbers (e.g., `0.4.1-dev.1`, `0.4.1-dev.2`)
3. **Manual version management**: Version numbers in `package.json` must be manually updated for each release
4. **No semantic version automation**: The workflow does not leverage git tags or commit history to determine version numbers

This creates friction in the release process and makes it difficult to:
- Publish development builds for testing
- Track which development build corresponds to which commit
- Automate the full release workflow

## Goals

1. **Tag-based releases**: When a git tag matching pattern `v*` is pushed, publish the package using the tag version as-is
2. **Development releases**: When commits are pushed to `main` without a tag, automatically generate and publish a development version
3. **Automated versioning**: Use GitHub Actions to determine and set the appropriate version without manual `package.json` updates
4. **Maintain consistency**: Ensure published npm versions align with GitHub releases

## Non-Goals

- Changing the existing package scope (`@ducky7go/steamworks.js`)
- Modifying the build configuration or targets
- Altering the Release Drafter workflow (separate concern)

## Proposed Solution

### 1. Tag-based Release Flow

When a git tag matching `v*` (e.g., `v0.5.0`) is pushed:
- Extract the version from the git tag (strip `v` prefix)
- Update `package.json` version to match the tag
- Build and publish to npm with the official version
- This replaces the current behavior where every main branch push publishes

### 2. Development Release Flow

When commits are pushed to `main` (without a tag):
- Query the GitHub Releases API to find the latest official release version
- Generate a development version by appending `-dev.{commit_count}` or similar
- Update `package.json` version accordingly
- Build and publish to npm with the development version
- Use the npm `--tag dev` flag to publish to the `dev` dist-tag

### 3. Workflow Changes

The `publish.yml` workflow will be enhanced with:

```yaml
on:
  push:
    branches: [main]
    tags:
      - 'v*'
```

And new job steps to:
- Detect whether the trigger was a tag or branch push
- For tags: use `GITHUB_REF_NAME` as the version
- For branches: query GitHub API for latest release and compute dev version
- Set the npm version before building
- Use appropriate npm dist-tag (`latest` for tags, `dev` for main branch)

## Affected Components

- `.github/workflows/publish.yml` - Main workflow file to be modified
- `package.json` - Version will be set dynamically during CI
- `openspec/specs/ci-cd/spec.md` - Will be updated with new versioning requirements

## Dependencies

- GitHub Actions token with `contents:read` permission (for querying releases)
- Existing `NPM_TOKEN` secret for publishing
- No new external dependencies required

## Alternatives Considered

### Alternative 1: Use semantic-release
- **Pros**: Full-featured automated versioning based on commits
- **Cons**: Overkill for current needs, requires significant config, changes commit conventions
- **Decision**: Not chosen - prefer simpler, more explicit approach

### Alternative 2: Manual versioning only
- **Pros**: Full control, no automation complexity
- **Cons**: Manual process is error-prone and time-consuming
- **Decision**: Not chosen - automation is a stated goal

### Alternative 3: Separate workflows for tags and branches
- **Pros**: Clear separation of concerns
- **Cons**: Code duplication, harder to maintain
- **Decision**: Not chosen - single workflow with conditional logic is simpler

## Migration Path

1. Update `publish.yml` with new version detection logic
2. Test development releases by pushing to `main` (will publish to `@ducky7go/steamworks.js@dev`)
3. Test tag releases by creating and pushing a test tag (e.g., `v0.5.0-test.0`)
4. Verify npm packages are published correctly
5. Document the new release process

## Success Criteria

- [x] Pushing to `main` publishes a development version (e.g., `0.4.1-dev.1`)
- [x] Pushing a tag `v0.5.0` publishes official version `0.5.0`
- [x] Development versions use npm `dev` dist-tag
- [x] Official versions use npm `latest` dist-tag
- [x] Version numbers are automatically determined without manual `package.json` updates
- [x] All existing CI checks and build steps continue to pass

## Open Questions

1. Should development versions use `-dev.{commit_count}` or `-dev.{git_hash}` format?
   - **Recommendation**: Use `-dev.{commit_count}` for cleaner, sortable versions
2. Should we publish to npm on every main branch commit, or add a manual trigger?
   - **Recommendation**: Publish automatically for now; can add manual trigger later if needed
3. Should development releases skip the full build and use cached artifacts?
   - **Recommendation**: No - build each time to ensure correctness

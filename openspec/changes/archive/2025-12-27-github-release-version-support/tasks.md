# Tasks: GitHub 发布版本号支持

## Overview

This document outlines the implementation tasks for the GitHub release version support feature. Tasks are ordered by dependency and should be completed sequentially.

## Tasks

### 1. Create spec delta for automated version management capability

Create a new spec file defining requirements for automated version management in CI/CD.

**Deliverables**:
- `openspec/changes/github-release-version-support/specs/version-management/spec.md`

**Validation**:
- Spec follows OpenSpec format with ADDED requirements
- Each requirement has at least one Scenario
- Run `npx openspec validate github-release-version-support --strict`

**Dependencies**: None

---

### 2. Add tag trigger to publish.yml workflow

Extend the workflow trigger configuration to support git tags.

**Deliverables**:
- Modified `.github/workflows/publish.yml` with `tags: ['v*']` trigger

**Changes**:
```yaml
on:
    push:
        branches: [main]
        tags:
            - 'v*'
    pull_request:
```

**Validation**:
- Workflow YAML is valid syntax
- Run `yamllint .github/workflows/publish.yml` or equivalent

**Dependencies**: Task 1

---

### 3. Add version detection logic to workflow

Add a step in the deploy job to detect whether the trigger was a tag or branch push, and set the appropriate version.

**Deliverables**:
- New step in `.github/workflows/publish.yml` deploy job to determine version

**Changes**:
- For tags: Extract version from `GITHUB_REF_NAME` (strip `v` prefix)
- For branches: Query GitHub API for latest release and generate dev version
- Set environment variable `NPM_VERSION` for use in publish step

**Example implementation**:
```yaml
- name: Determine version
  id: version
  run: |
    if [[ "${{ github.event_name }}" == "push" && "${{ github.ref_type }}" == "tag" ]]; then
      VERSION="${GITHUB_REF_NAME#v}"
      echo "version=$VERSION" >> $GITHUB_OUTPUT
      echo "is_release=true" >> $GITHUB_OUTPUT
    else
      # Query latest release and generate dev version
      LATEST=$(gh release view --json tagName -q '.tagName' || echo "v0.0.0")
      BASE_VERSION="${LATEST#v}"
      COMMIT_COUNT=$(git rev-list --count HEAD)
      DEV_VERSION="${BASE_VERSION}-dev.${COMMIT_COUNT}"
      echo "version=$DEV_VERSION" >> $GITHUB_OUTPUT
      echo "is_release=false" >> $GITHUB_OUTPUT
    fi
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Validation**:
- Manual test by pushing to main (should generate dev version)
- Manual test by pushing a tag (should use tag version)

**Dependencies**: Task 2

---

### 4. Update package.json version before building

Add a step to update `package.json` with the determined version before the build steps.

**Deliverables**:
- New step in `.github/workflows/publish.yml` to update package.json

**Changes**:
```yaml
- name: Update package version
  run: npm version ${{ steps.version.outputs.version }} --no-git-tag-version
```

**Validation**:
- Build artifacts contain correct version in their package.json
- Manual verification by inspecting dist/ directory contents

**Dependencies**: Task 3

---

### 5. Configure npm dist-tag based on release type

Modify the npm-publish action to use appropriate dist-tag based on whether this is a release or development build.

**Deliverables**:
- Modified npm-publish step in `.github/workflows/publish.yml`

**Changes**:
```yaml
- name: Publish to npm
  uses: JS-DevTools/npm-publish@v1
  with:
      token: ${{ secrets.NPM_TOKEN }}
      tag: ${{ steps.version.outputs.is_release == 'true' && 'latest' || 'dev' }}
```

**Validation**:
- Development publishes go to npm `dev` tag: `npm i @ducky7go/steamworks.js@dev`
- Release publishes go to npm `latest` tag: `npm i @ducky7go/steamworks.js`

**Dependencies**: Task 3, Task 4

---

### 6. Update ci-cd spec with versioning requirements

Add the new automated version management requirements to the `ci-cd` spec.

**Deliverables**:
- Updated `openspec/specs/ci-cd/spec.md` with new requirements
- Spec delta in `openspec/changes/github-release-version-support/specs/ci-cd/spec.md`

**Changes**:
- Add MODIFIED requirements for automated versioning
- Include scenarios for tag-based releases
- Include scenarios for development releases

**Validation**:
- Run `npx openspec validate github-release-version-support --strict`

**Dependencies**: Task 1

---

### 7. Add workflow permissions for GitHub API access

Ensure the workflow has necessary permissions to query GitHub releases.

**Deliverables**:
- Updated `.github/workflows/publish.yml` with required permissions

**Changes**:
```yaml
permissions:
    contents: read
```

**Validation**:
- Workflow runs successfully without permission errors
- GitHub API calls for releases work correctly

**Dependencies**: Task 3

---

### 8. Document the release process

Add documentation explaining the new release workflow.

**Deliverables**:
- Updated `CLAUDE.md` or appropriate documentation file

**Content**:
- How to create an official release: `git tag v0.5.0 && git push origin v0.5.0`
- How development releases work: automatic on push to main
- How to install development builds: `npm i @ducky7go/steamworks.js@dev`

**Validation**:
- Documentation is clear and accurate
- Follows project documentation conventions

**Dependencies**: Task 5

---

## Parallelizable Work

The following tasks can be done in parallel:
- Task 1, Task 2, Task 8 (documentation prep)
- Task 6, Task 7, Task 8 (after core tasks complete)

## Testing Checklist

After implementation, verify:
- [x] Pushing to `main` publishes a development version
- [x] Development versions use npm `dev` dist-tag
- [x] Pushing a `v*` tag publishes an official version
- [x] Official versions use npm `latest` dist-tag
- [x] Version numbers match expectations
- [x] All builds pass (Rust formatting, clippy, npm build)
- [x] All platforms build successfully (Windows, Linux, macOS)

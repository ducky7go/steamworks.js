# Change: Add GitHub Action Release Drafter Workflow

## Why

The project currently lacks an automated release notes generation mechanism. Manual changelog creation is time-consuming and error-prone. A structured release workflow will improve version management consistency and reduce release overhead.

## What Changes

- Add Release Drafter GitHub Action for automated release notes generation
- Configure automatic pre-release creation on main branch pushes
- Configure official release creation on git tag pushes
- Add release-drafter.yml configuration with commit categorization
- Update publish.yml workflow to integrate with release workflow

## Impact

- **Affected specs**: `ci-cd` (new capability to be created)
- **Affected code**:
  - `.github/workflows/release-drafter.yml` (new)
  - `.github/release-drafter.yml` (new configuration)
  - `.github/workflows/publish.yml` (potential modifications for integration)
- **Dependencies**: Release Drafter GitHub Action (https://github.com/marketplace/actions/release-drafter)

## Key Features

1. **Automated Changelog Generation**: Commits are automatically categorized by conventional commit prefixes
2. **Dual Release Strategy**:
   - Pre-releases: Automatically created on each main branch push
   - Official releases: Created when version tags are pushed
3. **Structured Release Notes**: Changes are grouped by category (features, fixes, breaking changes, etc.)

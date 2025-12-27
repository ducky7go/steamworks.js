# version-management Specification Delta

## Purpose

Defines automated version management capabilities for the CI/CD pipeline, supporting both official releases (via Git tags) and development releases (via main branch commits).

## ADDED Requirements

### Requirement: Automated version detection from Git tags

The CI/CD pipeline SHALL automatically detect and extract version numbers from Git tags matching the pattern `v*` when creating official releases.

#### Scenario: Tag-based version extraction

**Given** a Git tag matching pattern `v*` is pushed (e.g., `v0.5.0`)
**And** the GitHub Actions workflow is triggered
**When** the version detection step executes
**Then** the version SHALL be extracted by stripping the `v` prefix from the tag name
**And** the extracted version (e.g., `0.5.0`) SHALL be used as the npm package version

#### Scenario: Tag triggers official release

**Given** a developer pushes a Git tag `v1.2.3` to the repository
**When** the publish workflow completes
**Then** the npm package SHALL be published with version `1.2.3`
**And** the package SHALL be published to the npm `latest` dist-tag

### Requirement: Development version generation for main branch commits

The CI/CD pipeline SHALL automatically generate development version numbers for commits pushed to the `main` branch without a Git tag.

#### Scenario: Development version format

**Given** a commit is pushed to the `main` branch without a Git tag
**And** the latest official release is `v0.4.0`
**When** the version detection step executes
**Then** a development version SHALL be generated as `{base_version}-dev.{commit_count}`
**And** the base version SHALL be derived from the latest GitHub release
**And** the commit count SHALL be the total number of commits in the repository

#### Scenario: Development version increments on each commit

**Given** the latest official release is `v0.4.0`
**And** the current commit count is 100
**When** a commit is pushed to main
**Then** the development version SHALL be `0.4.0-dev.100`
**When** another commit is pushed
**Then** the development version SHALL be `0.4.0-dev.101` (or higher)

#### Scenario: Development release uses dev dist-tag

**Given** a commit is pushed to the `main` branch without a Git tag
**When** the npm publish step executes
**Then** the package SHALL be published to the npm `dev` dist-tag
**And** users MAY install with `npm i @ducky7go/steamworks.js@dev`

### Requirement: Dynamic package.json version updates

The CI/CD pipeline SHALL dynamically update the `package.json` version field before building, without committing the change to Git.

#### Scenario: Version set before build

**Given** the version has been determined (either from tag or generated)
**When** the build steps execute
**Then** the `package.json` version field SHALL be updated to match the determined version
**And** the change SHALL NOT be committed to Git (use `--no-git-tag-version`)

#### Scenario: Build artifacts contain correct version

**Given** the `package.json` version has been set dynamically
**When** the native modules are built
**Then** the resulting npm package artifacts SHALL contain the dynamically set version

### Requirement: GitHub API integration for release queries

The CI/CD pipeline SHALL query the GitHub Releases API to determine the latest official release version when generating development versions.

#### Scenario: Query latest release

**Given** a development release is being built
**When** the version detection step needs the base version
**Then** the workflow SHALL query the GitHub Releases API using `gh release view`
**And** the `tagName` field SHALL be extracted from the latest release
**And** if no release exists, a default version of `v0.0.0` SHALL be used

#### Scenario: Workflow permissions for API access

**Given** the publish workflow requires GitHub API access
**When** the workflow is defined
**Then** the workflow MUST include `permissions: contents: read`
**And** the `GITHUB_TOKEN` MUST be passed to steps that call GitHub API

## Relationships

This specification extends the `ci-cd` spec:
- Builds upon "Automated Release Notes Generation" requirements
- Adds version automation to complement the existing Release Drafter workflow
- Integrates with `npm-publish` spec for publishing behavior

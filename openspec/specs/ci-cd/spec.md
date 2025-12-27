# ci-cd Specification

## Purpose
Defines CI/CD requirements including automated release notes generation via Release Drafter and automated version management for npm releases.
## Requirements
### Requirement: Automated Release Notes Generation

**[MODIFIED]** The system SHALL automatically generate release notes from commit messages when code is pushed to the repository, and SHALL support automated version management for both official and development releases.

#### Scenario: Pre-release creation on main branch push (UNCHANGED)

**Given** the Release Drafter workflow is configured
**When** a commit is pushed to the `main` branch
**Then** a pre-release SHALL be created or updated with:
- Auto-generated release notes from commits since last release
- Categorized changes (features, fixes, breaking changes, etc.)
- Pre-release designation in GitHub Releases

#### Scenario: Development package publish on main branch push (ADDED)

**Given** the publish workflow is configured
**When** a commit is pushed to the `main` branch without a Git tag
**Then** a development package version SHALL be automatically generated
**And** the package SHALL be published to npm with the `dev` dist-tag
**And** the version format SHALL be `{base_version}-dev.{commit_count}`

#### Scenario: Official release creation on tag push (MODIFIED)

**Given** the Release Drafter workflow is configured
**When** a git tag matching pattern `v*` is pushed (e.g., `v1.2.3`)
**Then** an official GitHub release SHALL be created with:
- Semantic version from tag
- Structured changelog from commits
- Release assets (if built by CI)
**And** the publish workflow SHALL be triggered
**And** the npm package SHALL be published with the exact tag version to the `latest` dist-tag

### Requirement: Commit Message Categorization

The system SHALL categorize commits into release note sections based on conventional commit prefixes or PR labels.

#### Scenario: Feature commits categorized

**Given** commits with conventional commits prefix `feat:` or `feature:`
**When** release notes are generated
**Then** these commits SHALL appear under "New Features" section

#### Scenario: Bug fix commits categorized

**Given** commits with conventional commits prefix `fix:` or `bugfix:`
**When** release notes are generated
**Then** these commits SHALL appear under "Bug Fixes" section

#### Scenario: Breaking change commits categorized

**Given** commits labeled `breaking-change` or containing `BREAKING CHANGE:`
**When** release notes are generated
**Then** these commits SHALL appear under "Breaking Changes" section with prominent display

### Requirement: Release Drafter Configuration

The system SHALL provide a Release Drafter configuration file that defines commit categories and release note templates.

#### Scenario: Configuration file exists

**Given** the repository is checked out
**When** [`.github/release-drafter.yml`](../../../.github/release-drafter.yml) is viewed
**Then** the file SHALL exist with:
- Version template using semantic versioning
- Tag template with `v` prefix
- Category mappings for common commit types
- Change template formatting

#### Scenario: Workflow file exists

**Given** the repository is checked out
**When** [`.github/workflows/release-drafter.yml`](../../../.github/workflows/release-drafter.yml) is viewed
**Then** the file SHALL exist with:
- Trigger on `main` branch push
- Trigger on tag push matching `v*`
- Contents write permission
- Reference to Release Drafter action

### Requirement: Conventional Commit Convention

The system SHALL document conventional commit patterns for contributors to ensure proper release note categorization.

#### Scenario: Commit convention documentation

**Given** a contributor wants to commit code
**When** they review the contribution guidelines
**Then** they SHALL find documented commit message patterns:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes
- `refactor:` for code refactoring
- `perf:` for performance improvements
- `test:` for test additions/changes
- `build:` for build system changes
- `ci:` for CI configuration changes

#### Scenario: Breaking change convention

**Given** a contributor makes a breaking API change
**When** they write the commit message
**Then** they SHALL use `BREAKING CHANGE:` in the commit body or add `breaking-change` label

### Requirement: Release Workflow Configuration

**[ADDED]** The publish workflow SHALL be configured to trigger on both branch pushes and tag pushes, with appropriate version handling for each case.

#### Scenario: Workflow triggers on tag push

**Given** the [.github/workflows/publish.yml](../../../.github/workflows/publish.yml) workflow file exists
**When** the workflow triggers are examined
**Then** the workflow SHALL be configured to trigger on:
- Push to `main` branch
- Push to tags matching pattern `v*`

#### Scenario: Version detection based on trigger type

**Given** the publish workflow has been triggered
**When** the version detection step executes
**Then** the workflow SHALL:
- If triggered by a tag: Extract version from `GITHUB_REF_NAME`
- If triggered by a branch push: Query GitHub API for latest release and generate dev version

#### Scenario: Workflow permissions configuration

**Given** the publish workflow requires GitHub API access
**When** the workflow permissions are examined
**Then** the workflow MUST include:
```yaml
permissions:
    contents: read
```

### Requirement: Automated Version Detection

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

### Requirement: Development Version Generation

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

### Requirement: Dynamic Package Version Updates

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

### Requirement: GitHub API Integration for Release Queries

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


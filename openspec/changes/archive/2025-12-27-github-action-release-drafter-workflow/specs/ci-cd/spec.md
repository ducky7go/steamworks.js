# CI/CD Capability Specification (Delta)

This spec defines the requirements for automated release management using GitHub Actions.

## ADDED Requirements

### Requirement: Automated Release Notes Generation

The system SHALL automatically generate release notes from commit messages when code is pushed to the repository.

#### Scenario: Pre-release creation on main branch push

**Given** the Release Drafter workflow is configured
**When** a commit is pushed to the `main` branch
**Then** a pre-release SHALL be created or updated with:
- Auto-generated release notes from commits since last release
- Categorized changes (features, fixes, breaking changes, etc.)
- Pre-release designation in GitHub Releases

#### Scenario: Official release creation on tag push

**Given** the Release Drafter workflow is configured
**When** a git tag matching pattern `v*` is pushed (e.g., `v1.2.3`)
**Then** an official GitHub release SHALL be created with:
- Semantic version from tag
- Structured changelog from commits
- Release assets (if built by CI)

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

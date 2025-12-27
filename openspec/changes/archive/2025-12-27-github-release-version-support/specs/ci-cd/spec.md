# ci-cd Specification Delta

## MODIFIED Requirements

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

## Relationships

This specification modifies the existing `ci-cd` spec:
- Extends "Automated Release Notes Generation" requirement
- Adds new "Release Workflow Configuration" requirement
- Integrates with new `version-management` spec

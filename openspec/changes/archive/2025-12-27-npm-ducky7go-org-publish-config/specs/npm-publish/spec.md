## ADDED Requirements

### Requirement: Scoped package name under @ducky7go organization

The npm package SHALL be published under the `@ducky7go` organization scope with the name `@ducky7go/steamworks.js`.

#### Scenario: Package name in package.json

**Given** the project is configured for npm publishing
**When** a developer views [package.json](../../package.json)
**Then** the `name` field MUST be `@ducky7go/steamworks.js`

#### Scenario: npm publish uses scoped name

**Given** the GitHub Actions deploy job runs
**When** the npm-publish action executes
**Then** the package MUST be published to `@ducky7go/steamworks.js` on npm registry

### Requirement: Native module binary name

The native module binary name SHALL remain as `steamworksjs` without the scope prefix for compatibility.

#### Scenario: NAPI configuration

**Given** the project uses `@napi-rs/cli` for native bindings
**When** [package.json](../../package.json) napi configuration is viewed
**Then** `napi.name` MUST be `steamworksjs` (no scope prefix)

#### Scenario: Binary loading compatibility

**Given** a user installs `@ducky7go/steamworks.js`
**When** the native module is loaded
**Then** the binary MUST be loadable without name conflicts

### Requirement: CI/CD publish workflow

The GitHub Actions publish workflow SHALL be configured to deploy scoped packages to the @ducky7go organization.

#### Scenario: Repository deployment condition

**Given** the deploy job in [.github/workflows/publish.yml](../../.github/workflows/publish.yml)
**When** the repository check evaluates
**Then** the condition MUST match the target repository for @ducky7go organization

#### Scenario: NPM token authentication

**Given** the npm-publish action runs
**When** authenticating with npm registry
**Then** the NPM_TOKEN secret MUST have publish permissions for @ducky7go scope

### Requirement: Documentation updates

All project documentation SHALL reference the scoped package name `@ducky7go/steamworks.js`.

#### Scenario: README installation instructions

**Given** a developer views [README.md](../../README.md)
**When** reading the installation section
**Then** the npm install command MUST be `npm i @ducky7go/steamworks.js`

#### Scenario: Badge links

**Given** README.md displays npm badges
**When** badge URLs are viewed
**Then** they MUST link to `https://npmjs.com/package/@ducky7go/steamworks.js`

#### Scenario: Code examples

**Given** README.md contains code examples
**When** require statements are shown
**Then** they MAY use either `require('steamworks.js')` or `require('@ducky7go/steamworks.js')` (both resolve correctly)

### Requirement: Backward compatibility

Users of the package SHALL be able to require the package using the unscoped name due to npm's resolution, but MUST update their package.json to use the scoped name.

#### Scenario: Existing user migration

**Given** a user has `steamworks.js` in their package.json dependencies
**When** they update to use `@ducky7go/steamworks.js`
**Then** their require statements MAY remain as `require('steamworks.js')`
**And** they MUST update package.json to `"@ducky7go/steamworks.js": "version"`

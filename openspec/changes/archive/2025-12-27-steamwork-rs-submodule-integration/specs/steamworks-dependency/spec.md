# Steamworks Dependency Specification

## MODIFIED Requirements

### Requirement: Steamworks dependency SHALL be provided via git submodule
The project SHALL include steamworks-rs as a git submodule to provide source code access for AI-assisted code analysis and improved developer experience.

#### Scenario: Initial repository clone with submodules
**Given** a developer clones the repository using `git clone --recurse-submodules`
**Then** the steamworks-rs submodule at `vendor/steamworks-rs` must be automatically checked out at the correct revision
**And** the project must build successfully using `cargo build`

#### Scenario: Existing repository adds submodule support
**Given** a developer has an existing clone of steamworks.js without submodules
**When** they run `git submodule update --init --recursive`
**Then** the steamworks-rs submodule must be cloned and checked out at the correct revision
**And** subsequent builds must use the submodule source code

#### Scenario: Building with submodule dependency
**Given** the steamworks-rs submodule is present at `vendor/steamworks-rs`
**When** running `cargo build --release`
**Then** the build must use the local submodule source code
**And** the build must complete successfully with all steamworks API features available

#### Scenario: Updating steamworks-rs to a new revision
**Given** the steamworks-rs submodule needs to be updated
**When** a developer runs `cd vendor/steamworks-rs && git pull origin main && cd ../.. && git add vendor/steamworks-rs`
**Then** the submodule reference must be updated to the new commit
**And** the project must build successfully with the new revision

#### Scenario: AI code analysis with full context
**Given** an AI system analyzes the steamworks.js codebase
**When** the AI reads files that import from steamworks-rs (e.g., `src/lib.rs:3-5`)
**Then** the AI must be able to access and understand the steamworks-rs source code from the submodule
**And** cross-references between steamworks.js and steamworks-rs must be resolvable

## REMOVED Requirements

### Requirement: Steamworks dependency via git URL (DEPRECATED)
**Reason**: Replaced by submodule approach for better source code accessibility
**Migration**: The git URL dependency in Cargo.toml will be replaced with a path dependency pointing to the submodule

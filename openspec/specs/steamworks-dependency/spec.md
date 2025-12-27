# steamworks-dependency Specification

## Purpose
TBD - created by archiving change upgrade-steamworks-dep. Update Purpose after archive.
## Requirements
### Requirement: Steamworks dependency SHALL use latest upstream revision
The project SHALL use the latest revision of the steamworks-rs library to benefit from bug fixes and improvements.

#### Scenario: Developer updates to latest steamworks-rs revision
**Given** the project currently uses steamworks-rs at revision `fbb79635b06b4feea8261e5ca3e8ea3ef42facf9`
**When** a developer updates [Cargo.toml](../../Cargo.toml#L14) to revision `9841b63357c9b97508a567f207f03ca7c6d17e8a`
**Then** the project must compile successfully
**And** all existing tests must pass

#### Scenario: Build verification after dependency upgrade
**Given** the steamworks dependency has been updated to revision `9841b63357c9b97508a567f207f03ca7c6d17e8a`
**When** running `cargo build --release`
**Then** the build must complete without errors


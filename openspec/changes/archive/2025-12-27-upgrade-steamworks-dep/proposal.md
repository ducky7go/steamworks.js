# Upgrade steamworks-rs Dependency

## Summary
Upgrade the `steamworks` dependency from revision `fbb79635b06b4feea8261e5ca3e8ea3ef42facf9` to `9841b63357c9b97508a567f207f03ca7c6d17e8a` and verify compilation succeeds.

## Motivation
Keep dependencies up to date with the latest fixes and improvements from the upstream steamworks-rs project.

## Current Behaviour
- [Cargo.toml:14](../../Cargo.toml#L14) pins `steamworks` to git revision `fbb79635b06b4feea8261e5ca3e8ea3ef42facf9`

## Proposed Change
- Update the `steamworks` dependency to git revision `9841b63357c9b97508a567f207f03ca7c6d17e8a`
- Verify the project compiles successfully after the upgrade
- Run any existing tests to ensure no regressions

## Impact
- **Scope**: Single dependency version change
- **Risk**: Low - version bump only, no code changes expected
- **Testing**: Verify build succeeds, run existing test suite

## Alternatives Considered
- Use a tagged version instead of git revision - not applicable as upstream uses git revisions

## Open Questions
None - this is a straightforward dependency upgrade.

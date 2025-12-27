# workshop-queries Specification

## Purpose
TBD - created by archiving change list-children-hierarchical-data-support. Update Purpose after archive.
## Requirements
### Requirement: Workshop Query Children Support

The workshop query system SHALL support returning child items for collections and hierarchical workshop content through the `returnChildren` query configuration option.

#### Scenario: Enable children return in query config
- **WHEN** a workshop query is executed with `queryConfig.returnChildren = true`
- **THEN** each returned `WorkshopItem` that has children MUST include a `children` array property
- **AND** the `children` array MUST contain the child item IDs as `bigint` values
- **AND** the `numChildren` property MUST reflect the count of children returned

#### Scenario: Query without children return
- **WHEN** a workshop query is executed without `returnChildren` or with `returnChildren = false`
- **THEN** each returned `WorkshopItem` MUST NOT include a `children` array
- **AND** the `numChildren` property MUST still indicate the total number of children available

#### Scenario: Nested children support
- **WHEN** a workshop query is executed with `returnChildren = true`
- **THEN** the `children` array contains only child item IDs
- **AND** child items are NOT recursively expanded (no nested children in children)

#### Scenario: Empty or undefined children
- **WHEN** a `WorkshopItem` has no children (`numChildren = 0`)
- **THEN** the `children` property MUST be an empty array when `returnChildren = true`
- **OR** the `children` property MUST be `undefined` when `returnChildren` is not set or `false`

#### Scenario: Type safety for children property
- **WHEN** the `WorkshopItem` interface is used in TypeScript
- **THEN** the `children` property MUST be typed as `Array<bigint> | undefined`
- **AND** the property MUST be optional to maintain backward compatibility


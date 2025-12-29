# workshop-queries Specification

## Purpose
The workshop query system provides a way to query Steam Workshop items with various filtering and options for returning additional data like children and previews.

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

### Requirement: Workshop Query Additional Previews Support

The workshop query system SHALL support returning additional preview media (images, videos, Sketchfab models, etc.) for workshop items through the `includeAdditionalPreviews` query configuration option.

#### Scenario: Enable additional previews return in query config
- **WHEN** a workshop query is executed with `queryConfig.includeAdditionalPreviews = true`
- **THEN** each returned `WorkshopItem` that has additional previews MUST include an `additionalPreviews` array property
- **AND** the `additionalPreviews` array MUST contain `AdditionalPreview` objects with properties:
  - `urlOrVideoId`: The URL or video ID for the preview
  - `originalFileName`: The original filename of the preview
  - `type`: The preview type from `ItemPreviewType` enum

#### Scenario: Query without additional previews return
- **WHEN** a workshop query is executed without `includeAdditionalPreviews` or with `includeAdditionalPreviews = false`
- **THEN** each returned `WorkshopItem` MUST NOT include the `additionalPreviews` array

#### Scenario: Additional preview types
- **WHEN** additional previews are requested
- **THEN** the system MUST support all Steam preview types defined in `ItemPreviewType`:
  - `Image` (0): Standard image files (jpg, png, gif, etc.)
  - `YouTubeVideo` (1): YouTube video IDs
  - `Sketchfab` (2): Sketchfab model IDs
  - `EnvironmentMapHorizontalCross` (3): Cube map in horizontal cross layout
  - `EnvironmentMapLatLong` (4): Environment map in latitude/longitude format
  - `Clip` (5): Clip IDs
  - `ReservedMax` (255): Reserved for custom types

#### Scenario: Empty or undefined additional previews
- **WHEN** a `WorkshopItem` has no additional previews
- **THEN** the `additionalPreviews` property MUST be `undefined` when `includeAdditionalPreviews = true` and no previews exist
- **OR** the `additionalPreviews` property MUST be an empty array when `includeAdditionalPreviews = true` and no previews exist
- **OR** the `additionalPreviews` property MUST be `undefined` when `includeAdditionalPreviews` is not set or `false`

#### Scenario: Type safety for additional previews property
- **WHEN** the `WorkshopItem` interface is used in TypeScript
- **THEN** the `additionalPreviews` property MUST be typed as `Array<AdditionalPreview> | undefined`
- **AND** the property MUST be optional to maintain backward compatibility
- **AND** the `AdditionalPreview` interface MUST include:
  - `urlOrVideoId: string`
  - `originalFileName: string`
  - `type: ItemPreviewType`

#### Scenario: Backward compatibility
- **WHEN** existing code uses `WorkshopItem` without requesting additional previews
- **THEN** the code MUST continue to work without any changes
- **AND** the `additionalPreviews` property MUST be optional
- **AND** queries without `includeAdditionalPreviews` MUST work correctly

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

### Requirement: Workshop Per-Language Content Update

The Workshop content update system SHALL support setting localized content (title and description) for a specific language through an optional `language` parameter in the `UgcUpdate` interface. Due to Steam API constraints, only one language can be updated per operation.

#### Scenario: Update Workshop item with specific language
- **WHEN** a Workshop item update is submitted with `language` parameter set to a valid Steam language code (e.g., "english", "schinese", "french")
- **THEN** the system MUST call Steam API methods with the language parameter to set the title and description for that specific language
- **AND** the update MUST apply only to the specified language

#### Scenario: Update without language parameter (backward compatibility)
- **WHEN** existing code calls `updateItem()` or `updateItemWithCallback()` with only `title` and `description` properties (no `language` parameter)
- **THEN** the update MUST work exactly as before this change
- **AND** the behavior MUST be identical to the pre-implementation behavior
- **AND** no breaking changes MUST be introduced to the existing API surface

#### Scenario: Multiple language updates require multiple calls
- **WHEN** a developer needs to update content for multiple languages
- **THEN** the developer MUST call `updateItem()` separately for each language
- **AND** each call MUST include the `language` parameter specifying the target language
- **AND** the calls MAY be made sequentially or in parallel

#### Scenario: Invalid language code handling
- **WHEN** the `language` parameter contains a value that is not a valid Steam language code
- **THEN** the system MUST reject the update with a clear error message indicating the invalid language code
- **AND** the error message SHOULD list supported language codes

#### Scenario: Type safety for language parameter
- **WHEN** the `UgcUpdate` interface is used in TypeScript
- **THEN** the `language` property MUST be typed as `string | undefined`
- **AND** the property MUST be optional to maintain backward compatibility
- **AND** JSDoc comments SHOULD document common Steam language codes

#### Scenario: Common Steam language codes support
- **WHEN** developers use common Steam language codes
- **THEN** the system MUST support at minimum: `english`, `schinese`, `tchinese`, `german`, `french`, `italian`, `korean`, `spanish`, `russian`, `japanese`, `portuguese`, `polish`
- **AND** SHOULD support all language codes defined in the Steamworks SDK documentation

#### Scenario: updateItemWithCallback with language parameter
- **WHEN** `updateItemWithCallback()` is called with `language` parameter in the update details
- **THEN** the progress callback MUST report status for the update operation
- **AND** the success callback MUST be invoked after the content is set for the specified language
- **AND** the behavior MUST match the Promise-based `updateItem()` method

#### Scenario: Parallel updates for different languages
- **WHEN** multiple `updateItem()` calls are made in parallel for different languages on the same item (e.g., using `Promise.all()`)
- **THEN** each call MUST execute independently
- **AND** the Steam backend MUST handle serialization of updates to prevent data corruption


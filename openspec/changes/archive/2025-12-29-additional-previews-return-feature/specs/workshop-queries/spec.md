## ADDED Requirements

### Requirement: Workshop Query Additional Previews Support

The workshop query system SHALL support returning additional preview assets (images, videos, 3D models, etc.) for workshop items through the `includeAdditionalPreviews` query configuration option.

#### Scenario: Enable additional previews return in query config
- **WHEN** a workshop query is executed with `queryConfig.includeAdditionalPreviews = true`
- **THEN** each returned `WorkshopItem` MUST include an `additionalPreviews` array property
- **AND** each item in `additionalPreviews` MUST contain `urlOrVideoId`, `originalFileName`, and `type` properties
- **AND** the `type` property MUST be one of the `ItemPreviewType` enum values

#### Scenario: Query without additional previews return
- **WHEN** a workshop query is executed without `includeAdditionalPreviews` or with `includeAdditionalPreviews = false`
- **THEN** each returned `WorkshopItem` MUST NOT include an `additionalPreviews` array (undefined)
- **AND** the `previewUrl` property MUST still return the primary preview URL

#### Scenario: Additional preview types support
- **WHEN** additional previews are returned for a workshop item
- **THEN** the preview `type` property MUST correctly identify the media type:
  - `Image` (0) - Standard image files (jpg, png, gif, etc.)
  - `YouTubeVideo` (1) - YouTube video ID stored
  - `Sketchfab` (2) - Sketchfab 3D model ID stored
  - `EnvironmentMap_HorizontalCross` (3) - Cube map image in horizontal cross layout
  - `EnvironmentMap_LatLong` (4) - Cube map in latitude-longitude format
  - `Clip` (5) - Steam Clip ID stored
  - Values >= 255 - Custom preview types defined by the application

#### Scenario: Empty or undefined additional previews
- **WHEN** a `WorkshopItem` has no additional previews OR `includeAdditionalPreviews` is not set
- **THEN** the `additionalPreviews` property MUST be `undefined`
- **WHEN** a `WorkshopItem` has additional previews and `includeAdditionalPreviews = true`
- **THEN** the `additionalPreviews` property MUST be an array (possibly empty if Steam returns no previews)

#### Scenario: Type safety for additional previews property
- **WHEN** the `WorkshopItem` interface is used in TypeScript
- **THEN** the `additionalPreviews` property MUST be typed as `Array<AdditionalPreview> | undefined`
- **AND** the `AdditionalPreview` interface MUST have:
  - `urlOrVideoId: string` - URL or video ID for the preview
  - `originalFileName?: string` - Original filename of the preview
  - `type: ItemPreviewType` - Type identifier for the preview media

#### Scenario: Backward compatibility with existing queries
- **WHEN** existing code queries workshop items without setting `includeAdditionalPreviews`
- **THEN** the query MUST work exactly as before (no breaking changes)
- **AND** the `WorkshopItem` interface MUST remain backward compatible

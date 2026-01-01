## ADDED Requirements

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

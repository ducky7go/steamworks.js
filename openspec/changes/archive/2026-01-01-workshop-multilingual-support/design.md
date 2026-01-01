## Context

Steam Workshop is a core Steam platform feature allowing users to create and share game content. The steamworks.js library provides JavaScript/TypeScript bindings to the Steamworks SDK through steamworks-rs. Currently, Workshop content updates support only a single title and description per update operation.

Global developers need to localize their Workshop content for multiple regions. The Steam platform supports localized content through its API, but the current steamworks.js implementation does not expose this capability.

### Stakeholders
- Library maintainers (ducky7go)
- Game developers using Workshop for user-generated content
- International players consuming localized Workshop content

### Constraints
- Must maintain backward compatibility with existing single-language updates
- Bound by Steamworks SDK and steamworks-rs API capabilities
- N-API-RS bindings must serialize/deserialize between Rust and JavaScript

## Goals / Non-Goals

### Goals
- Enable per-language content updates for Workshop items
- Support at least the most common Steam languages (English, Simplified Chinese, French, German, Spanish, Japanese, Korean, Russian)
- Maintain backward compatibility with existing `title`/`description` properties
- Provide clear TypeScript types for language parameter

### Non-Goals
- Automatic translation of content (developers provide their own translations)
- Updating multiple languages in a single API call (Steam API limitation)
- Language detection or automatic locale selection
- Localization of other Workshop properties (tags, visibility, etc. remain language-agnostic)

## Decisions

### Decision 1: API Design for Localized Content

**Choice**: Extend `UgcUpdate` with an optional `language` property.

```typescript
interface UgcUpdate {
  title?: string
  description?: string
  // Existing properties...
  language?: string  // e.g., "english", "schinese", "french"
}
```

**Rationale**:
- Keeps existing API surface intact
- Steam API constraint: only one language can be updated per operation
- Simple string parameter for language code is sufficient and flexible
- Developers call `updateItem()` multiple times for multiple languages
- When `language` is omitted, defaults to the base/default content (typically English)

**Usage Pattern**:
```typescript
// Update English
await workshop.updateItem(itemId, {
  title: "My Mod",
  description: "English description",
  language: "english"
});

// Update Chinese (separate call)
await workshop.updateItem(itemId, {
  title: "我的模组",
  description: "中文描述",
  language: "schinese"
});
```

**Alternatives considered**:
1. **Separate method**: `updateContentLanguage(itemId, language, content)` - More verbose, less consistent with existing API
2. **Language enum instead of string**: More rigid, harder to extend with new Steam languages

### Decision 2: Steam Language Code Format

**Choice**: Use Steam's language code strings as keys (e.g., "english", "schinese", "french").

**Rationale**:
- Direct mapping to Steam API
- Developers familiar with Steam documentation will recognize these codes
- No need for custom enum translation layer

**Reference language codes** (from Steamworks SDK):
- english, schinese, tchinese, german, french, italian, korean, spanish, russian
- thai, japanese, portuguese, polish, danish, dutch, finnish, norwegian, swedish
- hungarian, czech, romanian, turkish, brazilian, bulgarian, greek, etc.

### Decision 3: Update Strategy for Multiple Languages

**Choice**: Each `updateItem()` call updates exactly one language. To update multiple languages, developers make multiple calls.

**Rationale**:
- This is a **Steam API constraint**
- Steamworks SDK `UpdateHandle` has `set_item_title(language)` and `set_item_description(language)` methods that set content for ONE language per update operation
- Each call is independent and can be made in any order
- Calls are serialized by Steam backend, so race conditions are not a concern

**Implementation pattern for multiple languages**:
```typescript
// Sequential updates
await workshop.updateItem(itemId, {
  title: "My Mod",
  description: "English description",
  language: "english"
});

await workshop.updateItem(itemId, {
  title: "Mon Mod",
  description: "Description française",
  language: "french"
});

// Or parallel (if item is not being actively modified)
await Promise.all([
  workshop.updateItem(itemId, {
    title: "Mein Mod",
    description: "Deutsche Beschreibung",
    language: "german"
  }),
  workshop.updateItem(itemId, {
    title: "Mi Mod",
    description: "Descripción en español",
    language: "spanish"
  })
]);
```

### Decision 4: Backward Compatibility

**Choice**: Existing `title`/`description` properties without `language` parameter continue to work as before.

**Rationale**:
- Zero breaking change for existing code
- When `language` is omitted, the update uses Steam's default language behavior
- Developers can add localization incrementally by adding `language` parameter to new calls
- Base content (without `language`) may serve as fallback depending on Steam's behavior

## Risks / Trade-offs

### Risk 1: Steamworks-rs Limited Localization Support

**Risk**: steamworks-rs may not expose language-parameterized update methods.

**Mitigation**:
- Task 1.1-1.2 in tasks.md explicitly research this
- If unavailable, may need to contribute to steamworks-rs or use direct FFI bindings
- Worst case: Document limitation and provide workaround guidance

### Risk 2: Multiple API Calls for Multiple Languages

**Risk**: Setting content for many languages requires multiple API calls, which could be slower.

**Mitigation**:
- This is unavoidable due to Steam API constraints
- Calls can be made in parallel using `Promise.all()` if the item is not being actively modified
- Steam backend serializes updates, so data consistency is maintained
- Network overhead is acceptable for typical number of languages (<10)

### Risk 3: Language Code Validation

**Risk**: Invalid language codes silently fail or cause unexpected behavior.

**Mitigation**:
- Validate language codes against Steam's supported list at runtime
- Provide TypeScript with autocomplete for common languages
- Clear error messages for invalid codes

## Migration Plan

### Steps for Existing Users

No migration required - existing code continues to work:

```typescript
// This continues to work
await workshop.updateItem(itemId, {
  title: "My Mod",
  description: "Description"
});
```

To add localization:

```typescript
// Update English content
await workshop.updateItem(itemId, {
  title: "My Mod",
  description: "English description",
  language: "english"
});

// Update Chinese content (separate call)
await workshop.updateItem(itemId, {
  title: "我的模组",
  description: "中文描述",
  language: "schinese"
});

// Update French content (separate call)
await workshop.updateItem(itemId, {
  title: "Mon Mod",
  description: "Description française",
  language: "french"
});
```

### Rollback

If issues arise:
- `language` property is optional - simply omit it
- Base `title`/`description` behavior is unchanged
- No data migration concerns (Workshop content is updated in-place)

## Open Questions

1. **Steam API capabilities confirmed?**
   - Need to verify if `set_item_title(language)` and `set_item_description(language)` are available in steamworks-rs
   - Resolution: Tasks 1.1-1.2 in tasks.md

2. **Default language behavior?**
   - What happens when `language` is omitted? Need to confirm Steam's default behavior
   - Resolution: Test during implementation, document observed behavior

3. **Should we provide a helper for updating multiple languages?**
   - Since multiple calls are needed, a utility function could be convenient
   - Resolution: Exclude from initial implementation, consider as future enhancement if users request it

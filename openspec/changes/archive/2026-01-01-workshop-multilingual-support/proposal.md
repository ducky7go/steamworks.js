# Change: Workshop Multilingual Content Support

## Why

The current Workshop content update implementation in steamworks.js only supports single-language content (title, description). For global developers targeting international audiences, there is no convenient way to set localized content for multiple languages in a single update operation. This limits the accessibility of Workshop content and forces developers to make multiple API calls or handle localization externally.

## What Changes

- **ADDED**: Language parameter support for Workshop content updates through the `UgcUpdate` interface
- **MODIFIED**: `workshop.updateItem()` and `workshop.updateItemWithCallback()` to accept a `language` parameter for specifying the target language of the content
- **ADDED**: New `Language` enum type with common Steam language codes
- **ADDED**: Steamworks-rs binding extensions to support Steam's localized content update API

**Note**: This change is backward compatible - existing single-language updates will continue to work as before, defaulting to English when no language is specified.

### API Constraint
Steam API only supports updating **one language at a time**. To set content for multiple languages, developers must make multiple `updateItem()` calls, one per language.

## Impact

### Affected specs
- `specs/workshop-queries/spec.md` - Extends Workshop content management capabilities

### Affected code
- `src/api/workshop.rs` - Rust implementation for content update
- `client.d.ts` - TypeScript type definitions for `UgcUpdate` interface
- `src/api/workshop_item.rs` - Workshop item update handling

### Dependencies
- Requires investigation of Steamworks SDK / steamworks-rs localization support

### API Changes
The `UgcUpdate` interface will be extended with an optional `language` property while keeping existing `title` and `description` properties for backward compatibility. When `language` is specified, the title and description will be set for that specific language.

Example usage:
```typescript
// Update English content
await workshop.updateItem(itemId, {
  title: "My Mod",
  description: "Description",
  language: "english"
});

// Update Chinese content (separate call)
await workshop.updateItem(itemId, {
  title: "我的模组",
  description: "中文描述",
  language: "schinese"
});
```
